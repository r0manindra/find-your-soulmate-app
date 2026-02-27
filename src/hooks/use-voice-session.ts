import { useState, useRef, useCallback, useEffect } from 'react';
import { createVoiceSession } from '@/src/services/api';

export type VoiceSessionState = 'idle' | 'connecting' | 'connected' | 'error' | 'ended';

const REALTIME_URL = 'https://api.openai.com/v1/realtime';
const MODEL = 'gpt-4o-mini-realtime-preview';
const MAX_SESSION_SECONDS = 600; // 10 minutes

// Lazy-load react-native-webrtc to avoid crashing in Expo Go
// (native module only available in dev builds)
function getWebRTC() {
  return require('react-native-webrtc') as {
    RTCPeerConnection: any;
    RTCSessionDescription: any;
    mediaDevices: any;
  };
}

export function useVoiceSession() {
  const [state, setState] = useState<VoiceSessionState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  const pcRef = useRef<any>(null);
  const dcRef = useRef<any>(null);
  const streamRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (dcRef.current) {
      try { dcRef.current.close(); } catch {}
      dcRef.current = null;
    }
    if (pcRef.current) {
      try { pcRef.current.close(); } catch {}
      pcRef.current = null;
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track: any) => {
          try { track.stop(); } catch {}
        });
      } catch {}
      streamRef.current = null;
    }
    setIsAISpeaking(false);
  }, []);

  const start = useCallback(async (params: {
    characterId: string;
    locale: string;
    chapterContext?: string;
  }) => {
    try {
      setState('connecting');
      setError(null);
      setElapsed(0);
      setIsAISpeaking(false);

      // Lazy-load WebRTC native module (crashes in Expo Go if loaded at top level)
      const { RTCPeerConnection, RTCSessionDescription, mediaDevices } = getWebRTC();

      // 1. Get ephemeral token from backend
      const { clientSecret } = await createVoiceSession(params);

      // 2. Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      pcRef.current = pc;

      // 3. Set up remote audio playback
      pc.ontrack = () => {
        // Remote audio track auto-plays in React Native WebRTC
      };

      // 4. Get mic stream
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      streamRef.current = stream;

      // Add mic tracks to peer connection
      stream.getTracks().forEach((track: any) => {
        pc.addTrack(track, stream);
      });

      // 5. Create data channel for events
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.onmessage = (event: any) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'response.audio.delta') {
            setIsAISpeaking(true);
          } else if (msg.type === 'response.audio.done' || msg.type === 'response.done') {
            setIsAISpeaking(false);
          }
        } catch {}
      };

      // 6. Create SDP offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      });
      await pc.setLocalDescription(offer);

      // 7. Send offer to OpenAI Realtime API
      const sdpResponse = await fetch(`${REALTIME_URL}?model=${MODEL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${clientSecret}`,
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      });

      if (!sdpResponse.ok) {
        throw new Error('Failed to establish WebRTC connection');
      }

      const answerSdp = await sdpResponse.text();

      // 8. Set remote SDP answer
      await pc.setRemoteDescription(
        new RTCSessionDescription({ type: 'answer', sdp: answerSdp })
      );

      setState('connected');

      // 9. Start session timer
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= MAX_SESSION_SECONDS) {
            // Auto-end at 10 minutes
            cleanup();
            setState('ended');
            return next;
          }
          return next;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Voice session start error:', err);
      cleanup();
      const message = err.message || 'Failed to connect';
      // Provide a clear message if running in Expo Go
      if (message.includes('native module') || message.includes("doesn't exist")) {
        setError('Voice coaching requires a development build. It is not available in Expo Go.');
      } else {
        setError(message);
      }
      setState('error');
    }
  }, [cleanup]);

  const stop = useCallback(() => {
    cleanup();
    setState('ended');
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    state,
    error,
    elapsed,
    isAISpeaking,
    start,
    stop,
    remaining: MAX_SESSION_SECONDS - elapsed,
  };
}

// src/lib/mediaUtils.ts

/**
 * Checks if the browser supports audio recording
 * @returns Object with support status and details
 */
export function checkAudioRecordingSupport() {
  const navigator = window.navigator;

  // Check if MediaRecorder is supported
  const hasMediaRecorder = typeof MediaRecorder !== "undefined";

  // Check if getUserMedia is supported
  const hasGetUserMedia = !!(
    navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  );

  // Determine audio MIME types support
  let supportedMimeTypes: string[] = [];

  if (hasMediaRecorder) {
    const candidateTypes = [
      "audio/webm",
      "audio/mp4",
      "audio/ogg",
      "audio/wav",
    ];

    supportedMimeTypes = candidateTypes.filter((type) =>
      MediaRecorder.isTypeSupported(type)
    );
  }

  return {
    isSupported: hasMediaRecorder && hasGetUserMedia,
    hasMediaRecorder,
    hasGetUserMedia,
    supportedMimeTypes,
  };
}

/**
 * Request microphone permissions
 * @returns Promise with access granted status
 */
export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Stop all tracks to release the microphone
    stream.getTracks().forEach((track) => track.stop());

    return true;
  } catch (error) {
    console.error("Error requesting microphone permission:", error);
    return false;
  }
}

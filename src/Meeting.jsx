import React from 'react'
import MyVideoConference from './MyVideoConference'
import { ControlBar, RoomAudioRenderer } from '@livekit/components-react'

const Meeting = () => {
  return (
    <div data-lk-theme="default" style={{ height: "100vh" }}>
        {/* Your custom component with basic video conferencing functionality. */}
        <MyVideoConference />
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        <RoomAudioRenderer />
        {/* Controls for the user to start/stop audio, video, and screen share tracks */}
        <ControlBar />
      </div>
  )
}

export default Meeting

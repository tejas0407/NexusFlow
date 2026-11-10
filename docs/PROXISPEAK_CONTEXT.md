# ProxiSpeak Handoff Context

This note carries forward relevant experience and context from the earlier Infotact Solutions internship project, **ProxiSpeak: Geospatial Proximity Audio Ecosystem**. ProxiSpeak remains a separate project; do not assume its implementation or requirements apply to NexusFlow.

## Earlier project snapshot

- Web development internship project for Infotact Solutions, reference ITS/WEB/1213.
- Project concept: a shared virtual room where participants communicate through WebRTC audio, with local audio gain adjusted according to virtual distance.
- The existing implementation used a React/Vite frontend, a virtual 2D canvas, WebRTC, Socket.io room presence/signaling, and a MongoDB-backed backend for room/audio-spot data.
- The live voice room used virtual canvas coordinates. Location-tagged audio spots were a separate feature, not GPS positioning for live participants.
- The project included contributions from Tejas, Jasmine Singh, and Palak Sinha. Backend ownership and integration were treated carefully because Palak was expected to commit her backend work.
- Documentation covered architecture, data flows, event/API contracts, setup, and known limitations. Frontend and backend contracts needed to agree for room creation and live voice to work.

## Useful lessons for NexusFlow

- Capture the real requirement and mentor acceptance criteria before choosing architecture.
- Keep ownership and component boundaries explicit when collaborating.
- Describe what is implemented separately from what is planned or pending.
- Document data contracts and integration assumptions early.
- Keep setup instructions, known limitations, and demo steps current.
- Use a general, professional project history in progress reviews and final documentation.

## Context boundary

The title, stack, architecture, features, team, and dates of ProxiSpeak do not define NexusFlow. NexusFlow's IoT telemetry and rule-engine requirements remain unspecified in the assignment letter and need confirmation.

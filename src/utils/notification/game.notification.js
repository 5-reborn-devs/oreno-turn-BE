import { serializer } from "../serilaizer.js"

const makeNotification = (message, type) => {
    const headerBuffer = serializer(message, type,1)

    return Buffer.concat([headerBuffer, message])
}
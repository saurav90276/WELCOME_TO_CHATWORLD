const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const UserModel = require('../models/UserModel')
const { ConversationModel, MessageModel } = require('../models/ConversationModel')
const getConversation = require('../helpers/getConversation')

const app = express()

/***socket connection */
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})

//online user
const onlineUser = new Set()

io.on('connection', async (socket) => {
    try {
        console.log("Connected socket:", socket.id);

        const token = socket.handshake.auth?.token;

        if (!token) {
            console.log("Socket authentication failed: token missing");
            socket.disconnect(true);
            return;
        }

        const user = await getUserDetailsFromToken(token);

        if (!user || !user._id) {
            console.log("Socket authentication failed: invalid token or user not found");
            socket.disconnect(true);
            return;
        }

        const userId = user._id.toString();

        // Join the current user's room
        socket.join(userId);

        // Track online users
        onlineUser.add(userId);

        console.log("Authenticated user:", userId);

        io.emit('onlineUser', Array.from(onlineUser));

        // Keep your existing socket.on(...) handlers here



        socket.on('message-page', async (userId) => {
            console.log('userId', userId)
            const userDetails = await UserModel.findById(userId).select("-password")

            const payload = {
                _id: userDetails?._id,
                name: userDetails?.name,
                email: userDetails?.email,
                profile_pic: userDetails?.profile_pic,
                online: onlineUser.has(userId)
            }
            socket.emit('message-user', payload)


            //get previous message
            const getConversationMessage = await ConversationModel.findOne({
                "$or": [
                    { sender: user?._id, receiver: userId },
                    { sender: userId, receiver: user?._id }
                ]
            }).populate('messages').sort({ updatedAt: -1 })

            socket.emit('message', getConversationMessage?.messages || [])
        })


        //new message
        socket.on('new message', async (data) => {

            //check conversation is available both user

            let conversation = await ConversationModel.findOne({
                "$or": [
                    { sender: data?.sender, receiver: data?.receiver },
                    { sender: data?.receiver, receiver: data?.sender }
                ]
            })

            //if conversation is not available
            if (!conversation) {
                const createConversation = await ConversationModel({
                    sender: data?.sender,
                    receiver: data?.receiver
                })
                conversation = await createConversation.save()
            }

            const receiverIsOnline = onlineUser.has(data?.receiver?.toString())

            const message = new MessageModel({
                text: data.text,
                imageUrl: data.imageUrl,
                videoUrl: data.videoUrl,
                msgByUserId: data?.msgByUserId,
                seen: false,
                delivered: receiverIsOnline
            })
            const saveMessage = await message.save()

            const updateConversation = await ConversationModel.updateOne({ _id: conversation?._id }, {
                "$push": { messages: saveMessage?._id }
            })

            const getConversationMessage = await ConversationModel.findOne({
                "$or": [
                    { sender: data?.sender, receiver: data?.receiver },
                    { sender: data?.receiver, receiver: data?.sender }
                ]
            }).populate('messages').sort({ updatedAt: -1 })


            io.to(data?.sender).emit('message', getConversationMessage?.messages || [])
            io.to(data?.receiver).emit('message', getConversationMessage?.messages || [])

            //send conversation
            const conversationSender = await getConversation(data?.sender)
            const conversationReceiver = await getConversation(data?.receiver)

            io.to(data?.sender).emit('conversation', conversationSender)
            io.to(data?.receiver).emit('conversation', conversationReceiver)
        })


        //sidebar
        socket.on('sidebar', async (currentUserId) => {
            console.log("current user", currentUserId)

            const conversation = await getConversation(currentUserId)

            socket.emit('conversation', conversation)

        })


        socket.on('seen', async (otherUserId) => {
            const currentUserId = user?._id?.toString()

            const conversation = await ConversationModel.findOne({
                "$or": [
                    { sender: currentUserId, receiver: otherUserId },
                    { sender: otherUserId, receiver: currentUserId }
                ]
            })

            if (!conversation) return

            // Mark messages from the other user as seen
            await MessageModel.updateMany(
                {
                    _id: { "$in": conversation.messages },
                    msgByUserId: otherUserId
                },
                {
                    "$set": {
                        seen: true,
                        delivered: true
                    }
                }
            )

            // Fetch updated messages
            const updatedConversation = await ConversationModel
                .findById(conversation._id)
                .populate('messages')

            const messages = updatedConversation?.messages || []

            // Update both chat windows
            io.to(currentUserId).emit('message', messages)
            io.to(otherUserId).emit('message', messages)

            // Refresh sidebar conversations
            const conversationSender = await getConversation(currentUserId)
            const conversationReceiver = await getConversation(otherUserId)

            io.to(currentUserId).emit('conversation', conversationSender)
            io.to(otherUserId).emit('conversation', conversationReceiver)
        })


        //disconnect
        socket.on('disconnect', () => {
            onlineUser.delete(user?._id?.toString())
            console.log('disconnect user ', socket.id)
        })
    }catch (error) {
        console.error("Socket connection error:", error.message);
        socket.disconnect(true);
    }
});

module.exports = {
    app,
    server
}


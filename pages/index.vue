<template>
    <div id="chat">
        <div class="top-bar">
            <img src="assets/svg/arrow-left.svg" alt="<-">
            <div class="groupPic"><img src="assets/svg/group.svg" alt=""></div>
            <div class="wrap"><h4>Chat de grupo</h4></div>

            <img class="rightIcons" src="assets/svg/phone.svg" alt="">
            <img class="phoneCall" src="assets/svg/settings.svg" alt="">
            
        </div>
        <div class="chat-box">
            <!--<div class="message">
                <div class="content"><div class="userName">Utilizador</div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, et!</div>
                <div class="data">9:15</div>
            </div>

            <div class="message me">
                <div class="content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, et!</div>
                <div class="data">12:45</div>
            </div>-->
            <template v-for="(message) in orderedMessages">
                <div class="message"  :class="`${message.userId === currentUserId ? 'me' : ''}`">
                    <div class="content"><div class="userName">{{message.userId}}</div>{{message.message}}</div>
                    <div class="data">{{`${new Date(message.date).getHours()}:${new Date(message.date).getMinutes()}`}}</div>
                </div>
            </template>
            
        </div>
        <div class="write-msg">
            <input type="text" placeholder="Type a message" v-model="messageToSend">
            <object class="svgIcon" data="assets/svg/paperclip.svg" type="image/svg+xml"></object>
            <object class="svgIcon" data="assets/svg/microphone.svg" type="image/svg+xml"></object>
            <div class="wrap" @click="sendMessage"><object class="svgIcon" data="assets/svg/send.svg" type="image/svg+xml"></object></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { io } from 'socket.io-client'
    const $io = io();

    let userId = "";

    const currentUserId = ref("");
    const messageToSend = ref("")
    const messageList = reactive([])

    onMounted(() => {
        const guidGenerator = () => {
            let S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            };
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        }

        userId = localStorage.getItem("userId") ? localStorage.getItem("userId") : null;

        if(userId === null) {
            userId = guidGenerator();
            localStorage.setItem("userId", userId);
        }

        currentUserId.value = userId;
    })

    const sendMessage = () => {
        $io.emit('message', {
            "userId": userId,
            "message": messageToSend.value
        })
        messageToSend.value = "";
    }
    
    $io.on("newMessage", (data) => {
        messageList.push(data)
    })

    const orderedMessages = computed(() => {
        return messageList.sort((a,b) => a.date - b.date);
    })

    
</script>

<style scoped lang="scss">
    * {
        display: block;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
    }

    #chat {
        display: grid;
        grid-template-rows: auto 1fr auto;
        position: relative;
        height: 100vh;
        width: calc(100vh * (9/16));
        background-image: url('assets/sky.jpg');
        background-position: center;
        background-size: cover;
        background-color: teal;

        &::before {
            user-select: none;
            content: '';
            position: absolute;
            display: block;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.45);
            z-index: 2;
        }

        .top-bar {
            width: 100%;
            min-height: 22px;
            padding: 8px;
            padding-left: 16px;
            padding-right: 16px;
            display: flex;
            align-items: center;
            z-index: 3;
            background: rgb(0,0,0);
            background: linear-gradient(180deg, rgba(0,0,0,0.8532680650385154) 0%, rgba(0,0,0,0.5199347317051821) 30%, rgba(0,0,0,0.36867422750350143) 60%, rgba(0,0,0,0) 100%); 

            img {
                display: block;
                height: 25px;
                filter: invert(99%) sepia(1%) saturate(5280%) hue-rotate(188deg) brightness(88%) contrast(83%);

                &:not(:first-of-type) {
                    height: 20px;
                }
            }

            .groupPic {
                height: 30px;
                width: 30px;
                background: rgba(16, 16, 16, 0.64);
                margin-left: 10px;
                border-radius: 100%;
                overflow: hidden;

                img {
                    margin-top: 5px;
                }
            }

             .wrap {
                margin-left: 5px;
                h4 {
                    color: rgb(202, 202, 208);
                }
            }

            .rightIcons {
                margin-left: auto;
                margin-right: 25px;
            }

        }

        .write-msg {
            width: 100%;
            min-height: 25px;
            background: rgba(255, 255, 255, 0.913);
            z-index: 3;
            display: grid;
            grid-template-columns: 7fr 1fr 1fr 1fr;
            gap: 12px;
            align-items: center;
            padding: 8px;
            padding-left: 16px;
            padding-right: 16px;

            input {
                width: 100%;
                height: 42px;
                background: transparent;
                border: transparent;
                outline: none;
            }

            .svgIcon {
                height: 25px;
                color: rgb(152, 152, 152);
                margin-inline: auto;
                filter: invert(82%) sepia(6%) saturate(11%) hue-rotate(329deg) brightness(83%) contrast(88%);

                &:nth-last-of-type() {
                    margin-left: auto;
                    margin-right: unset;
                }

                &:nth-last-child(1) {
                    filter: invert(50%) sepia(43%) saturate(730%) hue-rotate(150deg) brightness(92%) contrast(97%);
                }
            }

            object {
                pointer-events: none;
            }
        }

        .chat-box {
            overflow-y: scroll;
            padding: 8px;
            padding-inline: 15px;
            z-index: 3;

            .message {
                
                &:not(:first-of-type) {
                    margin-top: 22px;
                }

                .content{
                    display: block;
                    width: 85%;
                    background: rgb(230, 230, 245);
                    padding: 8px;
                    padding-inline: 12px;
                    border-radius: 16px;
                    border-top-left-radius: 0;

                    .userName {
                        color: rgb(144, 144, 144);
                    }
                }

                .data {
                    color: #fff;
                    font-size: .8em;
                    margin-top: 5px;
                    margin-left: 8px;
                }

                &.me {
                    .content {
                        border-radius: 16px;
                        border-top-right-radius: 0;
                        background: rgb(255, 141, 190);
                        margin-left: 15%;
                    }

                    .data {
                        text-align: right;
                        margin-right: 8px;
                        margin-left: auto;
                    }
                }
            }
        }
    }
    
</style>
// const ChatWindow = () => {
//   return <div className="flex flex-1 flex-col-reverse overflow-auto text-white">
//   {!allMessages.length && !incomingMessage && (
//     <div className="m-auto flex flex-col items-center justify-center gap-1 text-center">
//       <BsRobot size={70} className="p-1 text-emerald-200" />
//       <h1 className="text-4xl font-bold text-white/50">
//         Ask me a quetion!
//       </h1>
//     </div>
//   )}
//   {!!allMessages.length && (
//     <div className="mb-auto">
//       {allMessages.map((message, index) => (
//         <Message
//           key={message._id}
//           role={message.role}
//           content={message.content}
//         />
//       ))}
//       {/* {!!incomingMessage && !routeHasChanged && (
//         <Message role="assistant" content={incomingMessage.content} />
//       )} */}
//       {!!incomingMessage && !!routeHasChanged && (
//         <Message
//           role="notice"
//           content="Wait! Only one message at a time. Please allow anymother responses to complete before sending another message!"
//         />
//       )}
//     </div>
//   )}
// </div>
// };
// export default ChatWindow;

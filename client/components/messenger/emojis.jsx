//import React from 'react'
import dynamic from 'next/dynamic';
import classes from './emojies.module.css';
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const Emojis = ({ addEmoji }) => {

   const onEmojiClick = (event, emojiObject) => {
     return addEmoji(emojiObject.emoji)
   };
   
   return (
      <div className={classes.emojies}>
         <Picker 
            disableSkinTonePicker={true} 
            native={true}
            disableAutoFocus={true}
            onEmojiClick={onEmojiClick}
         />
      </div>
   );
}

export default Emojis
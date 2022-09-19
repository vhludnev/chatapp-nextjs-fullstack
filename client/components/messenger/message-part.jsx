import { format } from 'timeago.js';
import Image from 'next/image';

import classes from './message-part.module.css';

const Message = ({ message, own, bot, sender }) => {
  return (
    <div className={own ? [classes.message, classes.own].join(" ") : !bot ? [classes.message, classes.bot].join(" ") : classes.message}>
      <div className={classes.messageTop}>
        <div className={classes.messageImg}>
          <Image
            src={sender?.picture ? sender.picture : '/images/noimage.jpg'} 
            width={26}
            height={26}
            alt=''
          />
         </div>
         <p className={classes.messageText}>{message.text}</p>
      </div>
      <div className={classes.messageBottom}>{format(message.createdAt)}</div>
    </div>
  )
}

export default Message
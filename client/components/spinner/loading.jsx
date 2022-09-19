import classes from './loading.module.css';

const Loading = () => {

   return (
      <div className={classes.spinnerWrapper}>
         <div className={classes.spinner}></div>
      </div>
   );
}

export default Loading;
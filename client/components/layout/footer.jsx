import React from 'react';
import Link from 'next/link';
import LogoIcon from '../icons/logo';
import { FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';

import classes from './footer.module.css';

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footerLeft}>
         <LogoIcon />
         <p>Events you will not forget</p>
         <div className={classes.social}>
            <a href='#'><div><FaFacebookF color='#e7f2f4' size={21} /></div></a>
            <a href='#'><div><FaTwitter color='#e7f2f4' size={21} /></div></a>
            <a href='#'><div><FaYoutube color='#e7f2f4' size={21} /></div></a>
         </div>
      </div>
      <ul className={classes.footerRight}>
         <li>
            <h2>List of Events</h2>
            <ul className={classes.box}>
               <li><Link href='/'>Featured</Link></li>
               <li><Link href='/events'>All Events</Link></li>
               <li><a href='#'>Search</a></li>
            </ul>
         </li>
         <li className={classes.features}>
            <h2>Useful Links</h2>
            <ul className={classes.box}>
               <li><a href='#'>Some Useful Link</a></li>
               <li><a href='#'>Another Useful Link</a></li>
               <li><a href='#'>Another Useful Link</a></li>
               <li><a href='#'>More Useful Links</a></li>
            </ul>
         </li>
         <li>
            <h2>Address</h2>
            <div className={classes.box}>
               <p>125, World Street</p>
               <p>MA12 7PS, Wanty</p>
               <p>Manchester</p>
               <p>United Kingdom</p>
            </div>
         </li>
      </ul>
      <div className={classes.footerBottom}>
         <p>All Rights reserved 2022 by &copy; Chat Pro</p>
      </div>      
    </footer>
  )
}

export default Footer
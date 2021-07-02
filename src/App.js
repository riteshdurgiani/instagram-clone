import React ,{useState,useEffect}from 'react';
import Post from './Post'
import {db} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import ImageUpload from './ImageUpload';

import './App.css';
import { Button, Input } from '@material-ui/core';
import { auth } from './firebase';
import InstagramEmbed from 'react-instagram-embed'

function getModalStyle() {
  const top = 50 
  const left = 50 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
const classes = useStyles();
const [modalStyle] = useState(getModalStyle);
  const [posts,setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [openSignin,setOpenSignin] = useState('');
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [user,setUser] = useState(null);

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user Logged in
        console.log(authUser);
        setUser(authUser);

        
      }else{
        //user logged out
        setUser(null);
      }
    });

    return ()=>{
      //perform cleanup actions before reeffect
      unsubscribe();
    }


  },[user,username])

//use effect runs a piece of code based on specific condn 
  useEffect(()=>{
  //code runes here
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
      //snapshot fires on every single change in the databasw
      setPosts(snapshot.docs.map(doc =>({
        id:doc.id,
        post:doc.data()
      })
      
      ));

    });
  },[]);//if [] run once when refresh , if specified , once on refresh , secon on mentions

  const signUp = (event)=>{
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username,
      });
    })
    .catch((error)=>alert(error.message))
    setOpen(false)
  }

  const signIn = (event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message));
    setOpenSignin(false);
  }
  return (
    <div className="App">

   
    
    <Modal
     open={open}
      onClose={()=> setOpen(false)}
      
    >
    <div style={modalStyle} className={classes.paper}>
    <form className="app__signup">
    <center>
    <img 
       className="app__headerImage"
       src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
       alt=""/></center>
       <Input
         placeholder="username"
         type="text"
         value={username}
         onChange={(e)=>setUsername(e.target.value)}
       />
       <Input
         placeholder="email"
         type="text"
         value={email}
         onChange={(e)=>setEmail(e.target.value)}
       />
       <Input
       placeholder="password"
         type="password"
         value={password}
         onChange={(e)=>setPassword(e.target.value)}
       />
      
       <Button type="submit" onClick={signUp}>Sign Up</Button>
    
    </form>
     
    </div>
  </Modal>

  <Modal
     open={openSignin}
      onClose={()=> setOpenSignin(false)}
      
    >
    <div style={modalStyle} className={classes.paper}>
    <form className="app__signup">
    <center>
    <img 
       className="app__headerImage"
       src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
       alt=""/></center>
      
       <Input
         placeholder="email"
         type="text"
         value={email}
         onChange={(e)=>setEmail(e.target.value)}
       />
       <Input
       placeholder="password"
         type="password"
         value={password}
         onChange={(e)=>setPassword(e.target.value)}
       />
      
       <Button type="submit" onClick={signIn}>Sign Up</Button>
    
    </form>
     
    </div>
  </Modal>
     
      <div className="app__header">
        <img 
        className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
        alt=""/>
        {user ? (
          <Button onClick={()=>auth.signOut()}>Logout</Button>
        ):(
          
          <div className="app__loginContainer">
            <Button onClick={()=>setOpenSignin(true)}>Sign In</Button>
            <Button onClick={()=>setOpen(true)}>Sign up</Button>
          </div>
  
        )
      
      }
      </div>
      
      
      {/* Header */}
      <div className="app__posts">
      <div className="app__postsLeft">
      {
        posts.map( ({id,post}) =>(
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }
      </div>
      <div className="app__postsRight">
      <InstagramEmbed
      url='https://www.instagram.com/p/CE7NqDEFQMB/'
      maxWidth={320}
      hideCaption={false}
      containerTagName='div'
      protocol=''
      injectScript
      onLoading={() => {}}
      onSuccess={() => {}}
      onAfterRender={() => {}}
      onFailure={() => {}}
      />
      </div>
      
      </div>
     
      
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ):(
        <h3>Sorry you need to login to upload</h3>
      )}
      

    </div>
  );
}

export default App;

import React, {useState} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ApolloClient, InMemoryCache, useMutation, useSubscription, gql} from '@apollo/client';
import { WebSocketLink } from "@apollo/client/link/ws";
import {Container, Chip, Grid, TextField, Button, } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: 'dark', 
  },
});

const link = new WebSocketLink({
    uri: `ws://localhost:4000/`,
    options: {
      reconnect: true,
    },
});


export const client = new ApolloClient({
  link,
  uri: 'http://localhost:4000/', 
  cache: new InMemoryCache(),
});


const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      user
      text
    }
  }
`;

const POST_MESSAGE = gql`
  mutation($user:String!, $text:String!){
    postMessage(user:$user,text:$text)
  }
`;

const Messages = ({user}) =>{
    const {data} = useSubscription(GET_MESSAGES)
    if(!data){
        return null;
    }
    return (
      <div style={{marginBottom:"5rem"}}>
        {data.messages.map(({id, user:messageUser, text})=>{
          return(
            <div key={id} style={{textAlign: user===messageUser?"right":"left"}}>
              <p style={{marginBottom:"0.3rem"}}>{messageUser}</p>
              <Chip style={{fontSize:"0.9rem"}} color={user===messageUser?"primary": "secondary"} label={text}/>
            </div>
          )
        })}
      </div>
     )
}

export const Chat = () =>{
    const [user, setUser] = useState("Shefali");
    const [text, setText] = useState("");
    const [postMessage] = useMutation(POST_MESSAGE)
    const sendMessage=()=>{
      if(text.length>0 && user.length >0){
        postMessage({
          variables:{
            user: user,
            text: text
          }
        })
        setText("");
      }else{
        alert("Missing fields!")
      }
      
    }
    
    return(
      <ThemeProvider theme={darkTheme}>
        <Container >
          <Messages user={user}/>
          <Grid container spacing={2} >
            <Grid item xs={3} >
              <TextField onChange={(e)=>{
                setUser(e.target.value)}} value={user} size="small" fullWidth variant="outlined" required label="Required"  />
            </Grid>
            <Grid item xs={8}>
              <TextField onChange={(e)=>{
                setText(e.target.value)}} value={text} size="small" fullWidth variant="outlined" required label="Required"/>
            </Grid>
            <Grid item xs={1}>
              <Button onClick={sendMessage} fullWidth  variant="contained" style={{backgroundColor:"#60a820", color:"white", borderRadius:'20%'}}><img src='https://play-lh.googleusercontent.com/F5a3I0qOcUGHq6yYuEvpHGfAklwW3yAUyEWqgS-05k0QYwIogSZSSC08VDrAilKGWMs' alt='send btn' style={{width:"60%"}}
              ></img></Button>
            </Grid>
          </Grid>
        </Container>
        </ThemeProvider>
    )
}

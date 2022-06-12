import * as React from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {ApiAuth} from "../../global/global";
import {useContext, useState} from "react";
import {UserContext} from "../../utils/context";
import {getCurrentUser} from "../../utils/api";
import {TransitionAlert as Alert} from "../../components/alert";


const auth = async (data: any, f: Function) => {
  const url = `${ApiAuth}/signin`
  const res = await fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })

  if (res.status != 200) return false
  else {
    const data = await res.json()

    localStorage.setItem('__access_token__', data.access_token)
    localStorage.setItem('__refresh_token__', data.refresh_token)

    return await getCurrentUser(f)
  }
}

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="http://localhost:3000/">
        Matcha
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  const { setUser } = useContext(UserContext)
  const [open, setOpen] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const identity = {
      username: data.get('username'),
      password: data.get('password')
    }

    if  (!(await auth(identity, setUser)))
      setOpen(true)
  };

  return (
    <ThemeProvider theme={theme}>
      <Alert type='error' msg='Invalid username/password' open={open} f={setOpen} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

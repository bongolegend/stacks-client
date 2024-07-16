import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createUser, loginUser } from '../services/api';
import { RootStackParamList } from '../navigation/types';
import { useUser } from '../contexts/UserContext';
import { FIREBASE_AUTH, googleSignIn, signInWithGoogle, isFirstLogin } from '../utils/firebase-auth';

const FirebaseLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [ loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false)
  const auth = FIREBASE_AUTH;
  const { user, setUser, isLoading } = useUser();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'InApp'>;

  useEffect(() => {
    if (!isLoading && user) {
      alert('LOGGED IN TRIGGER NAV')
      navigation.navigate('InApp');
    }
  }, [user, isLoading, navigation]);

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async (data) => {
      console.log('createUser Data', data)
      setUser(data);
      navigation.navigate('InApp');
    },
  });

  const signUp = async () => {
    setLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      console.log('singup userCreds', userCredentials)
      const idToken = await userCredentials.user.getIdToken(true)
      // what is the correct way to pass args?
      createUserMutation.mutate({username: username, email:email, idToken: idToken })
      alert('Account Created')
    }catch (error: any) {
      console.log(error);
      alert('Sign up failed: ' + error.message);
    }finally {
      setLoading(false);
    }
  }

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      console.log('loginUser Data', data)
      setUser(data);
      navigation.navigate('InApp');
    },
  });
  
  const signIn = async () => {
    setLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      console.log('singIn userCreds', userCredentials)
      const idToken = await userCredentials.user.getIdToken(true)
      loginUserMutation.mutate({idToken: idToken, email: email})
    }catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    }finally {
      setLoading(false);
    }
  }
  

  const googleSignIn = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredentials = await signInWithPopup(FIREBASE_AUTH, provider);
      console.log('user credentials:', userCredentials);
      const idToken = await userCredentials.user.getIdToken(true)
      const email = userCredentials.user.email
      const isNewUser = isFirstLogin(
        userCredentials.user.metadata.creationTime, 
        userCredentials.user.metadata.lastSignInTime
      )
      if(isNewUser){
        const googleUserName = userCredentials.user.email.split('@')[0]
        createUserMutation.mutate({email:email, username: googleUserName, idToken: idToken})
      }else{
        loginUserMutation.mutate({idToken: idToken, email: email})
         }
      alert("signed in with Google")
    } catch (error) {
      console.error('Error during sign-in:', error);
      alert("Failed to sign in with google")
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
    
      <Button title={googleLoading ? "Logging in ..." : "Sign in with Google"}  onPress={googleSignIn} />

      <KeyboardAvoidingView behavior = 'padding'>
        <TextInput
          style={styles.input}
          placeholder="email"
          value={email}
          autoCapitalize='none'
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="password"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        />

        { loading ? <ActivityIndicator size="large" color = "#0000ff" />
        : <>
        <Button title="Login" onPress={() => signIn()} />
        <Button title="Create Account" onPress={() => signUp()} />
        </>}
      </KeyboardAvoidingView>
    </View>
  )

}

export default FirebaseLogin

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center'
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff'
  }
})


// import React, { useEffect, useState } from 'react';
// import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
// import { useMutation } from '@tanstack/react-query';
// import { useNavigation } from '@react-navigation/native';
// import { createUser, loginUser } from '../services/api';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../navigation/types';

// import { useUser } from '../contexts/UserContext';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, signInWithGoogle } from '../utils/firebase-auth'; 


// type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'InApp'>;

// const FirebaseLogin: React.FC = () => {
//   const navigation = useNavigation<LoginScreenNavigationProp>();
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const { user, setUser, isLoading } = useUser();

//   useEffect(() => {
//     if (!isLoading && user) {
//       navigation.navigate('InApp');
//     }
//   }, [user, isLoading, navigation]);

//   const createUserMutation = useMutation({
//     mutationFn: createUser,
//     onSuccess: (data) => {
//       setUser(data);
//       navigation.navigate('InApp');
//     },
//   });

//   const loginUserMutation = useMutation({
//     mutationFn: loginUser,
//     onSuccess: (data) => {
//       setUser(data);
//       navigation.navigate('InApp');
//     },
//   });

//   const handleCreateUser = async () => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, username);
//       const token = await userCredential.user.getIdToken();
//       createUserMutation.mutate({ email, username, token });
//     } catch (error) {
//       console.error('Error creating user:', error);
//     }
//   };

//   const handleLoginUser = async () => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, username);
//       const token = await userCredential.user.getIdToken();
//       loginUserMutation.mutate({ username, token });
//     } catch (error) {
//       console.error('Error logging in:', error);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithGoogle();
//       const token = await result.user.getIdToken();
//       setUser({ email: result.user.email, token });
//       navigation.navigate('InApp');
//     } catch (error) {
//       console.error('Error with Google sign-in:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {isLoading ? (
//         <Text>Loading...</Text>
//       ) : (
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Username"
//             value={username}
//             onChangeText={setUsername}
//           />
//           <Button title="Login" onPress={handleLoginUser} />
//           <Button title="Create Account" onPress={handleCreateUser} />
//           <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
//           {createUserMutation.isLoading && <Text>Loading...</Text>}
//           {createUserMutation.isError && <Text>Error creating user</Text>}
//           {loginUserMutation.isLoading && <Text>Loading...</Text>}
//           {loginUserMutation.isError && <Text>Error logging in</Text>}
//         </>
//       )}
//     </View>
//   );
// };

// export default FirebaseLogin;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   input: {
//     width: '100%',
//     padding: 8,
//     marginBottom: 16,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 4,
//   },
// });

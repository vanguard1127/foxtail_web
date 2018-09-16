import React from 'react';
import {withRouter} from 'react-router-dom';
import {Mutation} from 'react-apollo';
import {LOGIN} from '../../queries';
import Error from '../Error';

const initialState={
  username:"",
  email:"",
  password:"",
  passwordConfirm:"",
  phone:"",
  dob:"",
  desires:"",
  interestedIn:"",
  sex:""
};

class Signin extends React.Component{

  state={...initialState};

clearState=()=>{
this.setState({...initialState });
}

  handleChange = event =>{
const {name,value}=event.target;
this.setState({[name]:value});
  }

handleSubmit =(event,login)=>{
  event.preventDefault();
  login().then(async ({data})=>{
  console.log("comeback:",data);
    localStorage.setItem('token',data.login.token);
    await this.props.refetch();
    this.clearState();
    this.props.history.push('/');
});
  }

  validateForm=()=>{
    const {email,password}=this.state;
      const isInvalid =!email||!password;
      return isInvalid;
  }

  render(){
const {email,password}=this.state;

    return(
      <div>
        <h2 className="App">Signin</h2>
        <Mutation mutation={LOGIN} variables={{email,password}}>
          {(login,{data,loading,error})=>{

return(
<form className="form" onSubmit={event=>this.handleSubmit(event,login)}>
<input type="text" name="email" placeholder="Email Address" onChange={this.handleChange} value={email}/>
<input type="password" name="password" placeholder="Password" onChange={this.handleChange} value={password}/>
<button type="submit" disabled={loading||this.validateForm()} className="button-primary">Sign Up!</button>
{error && <Error error={error}/>}
</form>
);

          }}

        </Mutation>
      </div>
    )
  }
}

export default withRouter(Signin);

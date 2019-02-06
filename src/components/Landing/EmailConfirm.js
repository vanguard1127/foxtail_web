import axios from 'axios';
const EmailConfirm = props => {
  axios
    .get('http://localhost:4444' + '/confirmation/' + props.match.params.token)
    .then(() => {
      props.history.push({
        pathname: '/',
        state: { emailVer: true }
      });
    })
    .catch(() => {
      // handle error
      props.history.push({
        pathname: '/',
        state: { emailVer: false }
      });
    });
  return null;
};

export default EmailConfirm;

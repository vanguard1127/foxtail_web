import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import { SEND_PHONE_RESET_EMAIL } from '../../../queries';

class EmailPhoneResetBtn extends PureComponent {
  handleClick = sendPhoneResetEmail => {
    const { t, close } = this.props;

    sendPhoneResetEmail()
      .then(async ({ data }) => {
        alert(
          "If there is an account for that phone number, an email was sent with instructions to reset the phone number. If you used a bad email for the account, you'll have to contact us at support@foxtailapp.com for help."
        );
        close();
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });
        this.setState({ errors });
      });
  };
  render() {
    const { t, phone } = this.props;
    return (
      <Mutation mutation={SEND_PHONE_RESET_EMAIL} variables={{ phone }}>
        {sendPhoneResetEmail => {
          return (
            <span
              className="color"
              onClick={() => this.handleClick(sendPhoneResetEmail)}
            >
              Send Phone Reset
            </span>
          );
        }}
      </Mutation>
    );
  }
}

export default EmailPhoneResetBtn;

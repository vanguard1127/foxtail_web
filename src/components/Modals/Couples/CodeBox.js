import React, { PureComponent } from 'react';
import { GENERATE_CODE } from '../../../queries';
import { Query } from 'react-apollo';
import { EmailShareButton, EmailIcon } from 'react-share';
import Spinner from '../../common/Spinner';

class CodeBox extends PureComponent {
  render() {
    const { includeMsgs, setValue, t } = this.props;

    return (
      <div className="create-profile">
        <div className="couple-head">
          <span className="first">{t('createcoup')}?</span>
          <span className="second">{t('sendcode')} :</span>
        </div>
        <Query query={GENERATE_CODE} fetchPolicy="cache-first">
          {({ data, loading, error }) => {
            if (loading) {
              return (
                <Spinner message={t('common:Loading') + '...'} size="large" />
              );
            }
            if (!data.generateCode) {
              return <div>{t('common:error')}</div>;
            }
            const code = data.generateCode;
            return (
              <span>
                <div className="code">{code}</div>

                <div className="choose-box">
                  <div className="select-checkbox">
                    <input
                      type="checkbox"
                      id="cbox"
                      checked={includeMsgs ? true : false}
                      onChange={e => {
                        setValue({
                          name: 'includeMsgs',
                          value: !includeMsgs ? true : false
                        });
                      }}
                    />
                    <label htmlFor="cbox">
                      <span />
                      <b>{t('includemsg')}?</b>
                    </label>
                  </div>
                </div>
                <EmailShareButton
                  url={code}
                  subject={t('jointitle') + '.'}
                  body={t('joindets') + '.' + code + t('expires')}
                  className="Demo__some-network__share-button"
                >
                  <EmailIcon size={32} round />
                </EmailShareButton>
              </span>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default CodeBox;

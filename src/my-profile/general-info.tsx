import { BaseComponent, useUpdate } from 'react-hook-core';
import './general-info.css';
import { User } from './my-profile';
import React, { useEffect, useState } from 'react'
interface Props {
  user: User;
  resource: any;
  close: any;
  // saveEmit: any;
}
interface State {
  data: any;
}

const data: State = {
  data: {} as any
};

export const GeneralInfo = ({ resource, user, close }: Props) => {
  const { state, setState, updateState } = useUpdate<User>(user);


  close = () => {
    close();
    // const msg = ResourceManager.getString('success_save_my_profile');
    // this.showInfo(msg);
  }
  /*
    save = () => {
      const {data} = this.state;
      getMyProfileService().saveMyProfile(storage.getUserId(), data).subscribe(success => {
        let status = '';
        if (success) {
          status = 'success';
          this.setState({data});
        } else {
          status = 'fail';
        }
        this.props.saveEmit({status, data});
        this.close();
      });
    }
  */

  return (
    <div className='view-container profile-info'>
      <form model-name='data'>
        <header>
          <h2>{resource.user_profile_general_info}</h2>
          <button type='button' id='btnClose' name='btnClose' className='btn-close' onClick={close} />
        </header>
        <div>
          <section className='row'>
            <h4>{resource.user_profile_basic_info}</h4>
            <label className='col s12 m6'>
              {resource.first_name}
              <input id='firstName' name='firstName'
                value={state.firstName}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.placeholder_user_profile_first_name} />
            </label>
            <label className='col s12 m6'>
              {resource.last_name}
              <input id='lastName' name='lastName'
                value={state.lastName}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.placeholder_user_profile_last_name} />
            </label>
            <label className='col s12 m6'>
              {resource.user_profile_occupation}
              <input id='occupation' name='occupation'
                value={state.occupation}
                onChange={updateState}
                maxLength={500}
                placeholder={resource.placeholder_user_profile_occupation} />
            </label>
            <label className='col s12 m6'>
              {resource.user_profile_company}
              <input id='company' name='company'
                value={state.company}
                onChange={updateState}
                maxLength={500}
                placeholder={resource.placeholder_user_profile_company} />
            </label>
            <label className='col s12'>
              {resource.user_profile_website}
              <input id='website' name='website'
                data-type='url'
                value={state.website}
                onChange={updateState}
                maxLength={500}
                placeholder={resource.placeholder_user_profile_website} />
            </label>
          </section>
          <section>
            <h4>{resource.user_profile_social}</h4>
            <label className='inline-input'>
              <i className='fa fa-facebook' />
              <input id='facebookLink' maxLength={100} name='facebookLink'
                onChange={updateState} placeholder={resource.user_profile_facebook}
                value={state.facebookLink} />
            </label>
            <label className='inline-input'>
              <i className='fa fa-linkedin' />
              <input id='linkedInLink' maxLength={100} onChange={updateState}
                placeholder={resource.user_profile_linkedIn} name='linkedinLink' value={state.linkedinLink} />
            </label>
            <label className='inline-input'>
              <i className='fa fa-instagram' />
              <input id='instagramLink' maxLength={100} onChange={updateState}
                placeholder={resource.user_profile_instagram} name='instagramLink'
                value={state.instagramLink} />
            </label>
            <label className='inline-input'>
              <i className='fa fa-twitter' />
              <input id='twitter' maxLength={100} onChange={updateState}
                placeholder={resource.user_profile_twitter} name='twitterLink' value={state.twitterLink} />
            </label>
            <label className='inline-input'>
              <i className='fa fa-skype' />
              <input id='skype' name='skypeLink' maxLength={100}
                onChange={updateState}
                placeholder={resource.user_profile_skype} value={state.skypeLink} />
            </label>
            <label className='inline-input'>
              <i className='fa fa-dribbble' />
              <input id='dribble' name='dribbbleLink' maxLength={100}
                onChange={updateState}
                placeholder={resource.user_profile_dribbble} value={state.dribbbleLink} />
            </label>
          </section>
        </div>
        <footer>
          <button type='button' id='btnSave' name='btnSave'>
            {resource.save}
          </button>
        </footer>
      </form>
    </div>);

}
/*
// @ts-ignore
GeneralInfo.propTypes = {
  user: PropTypes.any,
  resource: PropTypes.any,
  close: PropTypes.func,
  saveEmit: PropTypes.func,
};
*/
export default GeneralInfo;

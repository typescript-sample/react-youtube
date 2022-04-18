import { OnClick, useUpdate } from 'react-hook-core';
import './general-info.css';
import { useGetMyProfileService, User } from './my-profile';
interface Props {
  user: User;
  resource: any;
  close: any;
  saveEmit: any;
}

interface State {
  user: User
};


export const GeneralInfo = ({ resource, user, close, saveEmit }: Props) => {
  const service = useGetMyProfileService()
  const { state, setState, updateState } = useUpdate<State>({ user }, 'user');


  const closeModal = () => {
    close();
    // const msg = ResourceManager.getString('success_save_my_profile');
    // this.showInfo(msg);
  }

  const save = (e: OnClick) => {
    e.preventDefault()
    const { user } = state;
    service.saveMyProfile(user).then(success => {
      let status = '';
      if (success) {
        status = 'success';
        setState({ user });
      } else {
        status = 'fail';
      }
      saveEmit({ status, user });
      close();
    });
  }


  return (
    <div className='view-container profile-info'>
      <form model-name='data'>
        <header>
          <h2>{resource.user_profile_general_info}</h2>
          <button type='button' id='btnClose' name='btnClose' className='btn-close' onClick={closeModal} />
        </header>
        <div>
          <section className='row'>
            <h4>{resource.user_profile_basic_info}</h4>
            <label className='col s12 m6'>
              {resource.first_name}
              <input id='firstName' name='firstName'
                value={state.user.firstName}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.placeholder_user_profile_first_name} />
            </label>
            <label className='col s12 m6'>
              {resource.last_name}
              <input id='lastName' name='lastName'
                value={state.user.lastName}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.placeholder_user_profile_last_name} />
            </label>
            <label className='col s12 m6'>
              {resource.user_profile_occupation}
              <input id='occupation' name='occupation'
                value={state.user.occupation}
                onChange={updateState}
                maxLength={500}
                placeholder={resource.placeholder_user_profile_occupation} />
            </label>
            <label className='col s12 m6'>
              {resource.user_profile_company}
              <input id='company' name='company'
                value={state.user.company}
                onChange={updateState}
                maxLength={500}
                placeholder={resource.placeholder_user_profile_company} />
            </label>
            <label className='col s12'>
              {resource.user_profile_website}
              <input id='website' name='website'
                data-type='url'
                value={state.user.website}
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
                value={state.user.facebookLink} />
            </label>
            <label className='inline-input'>
              <i className='fa fa-linkedin' />
              <input id='linkedInLink' maxLength={100} onChange={updateState}
                placeholder={resource.user_profile_linkedIn} name='linkedinLink' value={state.user.linkedinLink} />
            </label>
            <label className='inline-input'>
              <i className='fa fa-instagram' />
              <input id='instagramLink' maxLength={100} onChange={updateState}
                placeholder={resource.user_profile_instagram} name='instagramLink'
                value={state.user.instagramLink} />
            </label>
            <label className='inline-input'>
              <i className='fa fa-twitter' />
              <input id='twitter' maxLength={100} onChange={updateState}
                placeholder={resource.user_profile_twitter} name='twitterLink' value={state.user.twitterLink} />
            </label>
            <label className='inline-input'>
              <i className='fa fa-skype' />
              <input id='skype' name='skypeLink' maxLength={100}
                onChange={updateState}
                placeholder={resource.user_profile_skype} value={state.user.skypeLink} />
            </label>
            <label className='inline-input'>
              <i className='fa fa-dribbble' />
              <input id='dribble' name='dribbbleLink' maxLength={100}
                onChange={updateState}
                placeholder={resource.user_profile_dribbble} value={state.user.dribbbleLink} />
            </label>
          </section>
        </div>
        <footer>
          <button type='button' id='btnSave' name='btnSave' onClick={save}>
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

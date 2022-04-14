import React, { useEffect } from 'react'
import { BaseComponent, useUpdate } from 'react-hook-core';
import { useResource } from 'uione';
import { getMyProfileService, MyProfileService, UserSettings } from './my-profile';

interface InternalState {
  message: string;
  userSettings: UserSettings;
}

const data: InternalState = {
  userSettings: {} as any,
  message: ''
}
export const MySettingsForm = () => {
  const resource = useResource();
  const { state, setState, updateState } = useUpdate<InternalState>(data, 'userSettings');

  useEffect(() => {
    const userId = 'XU3rkqafp';
    getMyProfileService().getMySettings(userId).then(userSettings => {
      if (userSettings) {
        setState({ userSettings });
      }
    });
  }, [])



  const saveOnClick = (e: any) => {
    e.preventDefault();
    const userId = 'XU3rkqafp';
    const service: MyProfileService = getMyProfileService()
    console.log(state.userSettings)
    service.saveMySettings(userId, state.userSettings).then((result: any) => {
      if (result) {
        console.log('Save Setting successed');
      } else {
        console.log('Error');
      }
    });
  }


  // eslint-disable-next-line react-hooks/rules-of-hooks

  // const btnEmail = storage.getUser().passwordExpiredTime ? resource.button_change_email : resource.button_add_email;
  return (
    <div className='view-container'>
      <form id='mySettingsForm' name='mySettingsForm' model-name='userSettings'>
        <header>
          <h2>{resource.my_settings}</h2>
        </header>
        <div className='row'>
          <section className='col s12 m12 l6'>
            <h4>{resource.user_settings_member_profile_preferences}</h4>
            <label className='switch-container'>
              <input type='checkbox'
                id='searchEnginesLinksToMyProfile'
                name='searchEnginesLinksToMyProfile'
                // value={state.userSettings.searchEnginesLinksToMyProfile}
                checked={state.userSettings.searchEnginesLinksToMyProfile}
                onChange={updateState} />
              {resource.user_settings_search_engines_links_to_my_profile}
            </label>
            <label className='switch-container'>
              <input type='checkbox'
                id='followingListPublicOnMyProfile'
                name='followingListPublicOnMyProfile'
                // value={state.userSettings.followingListPublicOnMyProfile}
                checked={state.userSettings.followingListPublicOnMyProfile}
                onChange={updateState} />
              {resource.user_settings_search_engines_links_to_my_profile}
            </label>
          </section>
          <section className='col s12 m12 l6'>
            <h4>{resource.user_settings_around_me_references}</h4>
            <label className='switch-container'>
              <input type='checkbox'
                id='showMyProfileInSpacesAroundMe'
                name='showMyProfileInSpacesAroundMe'
                // value={state.userSettings.showMyProfileInSpacesAroundMe}
                checked={state.userSettings.showMyProfileInSpacesAroundMe}
                onChange={updateState} />
              {resource.user_settings_show_my_profile_in_spaces_around_me}
            </label>
            <label className='switch-container'>
              <input type='checkbox'
                id='showAroundMeResultsInMemberFeed'
                name='showAroundMeResultsInMemberFeed'
                // value={state.userSettings.showAroundMeResultsInMemberFeed}
                checked={state.userSettings.showAroundMeResultsInMemberFeed}
                onChange={updateState} />
              {resource.user_settings_show_around_me_results_in_member_feed}
            </label>
          </section>
          <section className='col s12 m12 l6'>
            <h4>{resource.user_settings_notification_preferences}</h4>
            <label className='switch-container'>
              <input type='checkbox'
                id='notification'
                name='notification'
                // value={state.userSettings.notification}
                checked={state.userSettings.notification}
                onChange={updateState} />
              {resource.user_settings_notifications}
            </label>
            <div className='checkbox-section'>
              {resource.user_settings_feed_updates}
              <div className='checkbox-group'>
                <label>
                  <input type='checkbox'
                    id='notifyFeedUpdates'
                    name='notifyFeedUpdates'
                    // value={state.userSettings.notifyFeedUpdates}
                    checked={state.userSettings.notifyFeedUpdates}
                  // onChange={this.updateState}
                  />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailFeedUpdates'
                    name='emailFeedUpdates'
                    // value={state.userSettings.emailFeedUpdates}
                    checked={state.userSettings.emailFeedUpdates}
                    onChange={updateState}
                  />
                  {resource.email}
                </label>
              </div>
            </div>
            <div className='checkbox-section'>
              {resource.user_settings_post_mentions}
              <div className='checkbox-group'>
                <label>
                  <input type='checkbox'
                    id='notifyPostMentions'
                    name='notifyPostMentions'
                    // value={state.userSettings.notifyPostMentions}
                    checked={state.userSettings.notifyPostMentions}
                    onChange={updateState} />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailPostMentions'
                    name='emailPostMentions'
                    // value={state.userSettings.emailPostMentions}
                    checked={state.userSettings.emailPostMentions}
                    onChange={updateState} />
                  {resource.email}
                </label>
              </div>
            </div>
            <div className='checkbox-section'>
              {resource.user_settings_comments_of_your_posts}
              <div className='checkbox-group'>
                <label>
                  <input type='checkbox'
                    id='notifyCommentsOfYourPosts'
                    name='notifyCommentsOfYourPosts'
                    // value={state.userSettings.notifyCommentsOfYourPosts}
                    checked={state.userSettings.notifyCommentsOfYourPosts}
                    onChange={updateState} />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailCommentsOfYourPosts'
                    name='emailCommentsOfYourPosts'
                    // value={state.userSettings.emailCommentsOfYourPosts}
                    checked={state.userSettings.emailCommentsOfYourPosts}
                    onChange={updateState} />
                  {resource.email}
                </label>
              </div>
            </div>
            <div className='checkbox-section'>
              {resource.user_settings_event_invitations}
              <div className='checkbox-group'>
                <label>
                  <input type='checkbox'
                    id='notifyEventInvitations'
                    name='notifyEventInvitations'
                    // value={state.userSettings.notifyEventInvitations}
                    checked={state.userSettings.notifyEventInvitations}
                    onChange={updateState} />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailEventInvitations'
                    name='emailEventInvitations'
                    // value={state.userSettings.emailEventInvitations}
                    checked={state.userSettings.emailEventInvitations}
                    onChange={updateState} />
                  {resource.email}
                </label>
              </div>
            </div>
            <div className='checkbox-section'>
              {resource.user_settings_when_new_events_around}
              <div className='checkbox-group'>
                <label>
                  <input type='checkbox'
                    id='notifyWhenNewEventsAround'
                    name='notifyWhenNewEventsAround'
                    // value={state.userSettings.notifyWhenNewEventsAround}
                    checked={state.userSettings.notifyWhenNewEventsAround}
                    onChange={updateState} />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailWhenNewEventsAround'
                    name='emailWhenNewEventsAround'
                    // value={state.userSettings.emailWhenNewEventsAround}
                    checked={state.userSettings.emailWhenNewEventsAround}
                    onChange={updateState} />
                  {resource.email}
                </label>
              </div>
            </div>
          </section>
        </div>
        <footer>
          <button type='submit' id='btnSave' name='btnSave' onClick={saveOnClick}>
            {resource.save}
          </button >
        </footer>
      </form>
    </div>
  );
}


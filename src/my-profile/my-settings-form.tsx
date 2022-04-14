import React, { useEffect } from 'react'
import { BaseComponent, useUpdate } from 'react-hook-core';
import { useResource } from 'uione';
import { getMyProfileService, MyProfileService, UserSettings } from './my-profile';

interface InternalState {
  message: string;
  settings: UserSettings;
}

const data: InternalState = {
  settings: {} as any,
  message: ''
}
export const MySettingsForm = () => {
  const resource = useResource();
  const { state, setState, updateState } = useUpdate<InternalState>(data, 'settings');

  useEffect(() => {
    const userId = 'XU3rkqafp';
    getMyProfileService().getMySettings(userId).then(settings => {
      if (settings) {
        setState({ settings });
      }
    });
  }, [])



  const saveOnClick = (e: any) => {
    e.preventDefault();
    const userId = 'XU3rkqafp';
    const service: MyProfileService = getMyProfileService()
    console.log(state.settings)
    service.saveMySettings(userId, state.settings).then((result: any) => {
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
      <form id='mySettingsForm' name='mySettingsForm' model-name='settings'>
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
                // value={state.settings.searchEnginesLinksToMyProfile}
                checked={state.settings.searchEnginesLinksToMyProfile}
                onChange={updateState} />
              {resource.user_settings_search_engines_links_to_my_profile}
            </label>
            <label className='switch-container'>
              <input type='checkbox'
                id='followingListPublicOnMyProfile'
                name='followingListPublicOnMyProfile'
                // value={state.settings.followingListPublicOnMyProfile}
                checked={state.settings.followingListPublicOnMyProfile}
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
                // value={state.settings.showMyProfileInSpacesAroundMe}
                checked={state.settings.showMyProfileInSpacesAroundMe}
                onChange={updateState} />
              {resource.user_settings_show_my_profile_in_spaces_around_me}
            </label>
            <label className='switch-container'>
              <input type='checkbox'
                id='showAroundMeResultsInMemberFeed'
                name='showAroundMeResultsInMemberFeed'
                // value={state.settings.showAroundMeResultsInMemberFeed}
                checked={state.settings.showAroundMeResultsInMemberFeed}
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
                // value={state.settings.notification}
                checked={state.settings.notification}
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
                    // value={state.settings.notifyFeedUpdates}
                    checked={state.settings.notifyFeedUpdates}
                  // onChange={this.updateState}
                  />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailFeedUpdates'
                    name='emailFeedUpdates'
                    // value={state.settings.emailFeedUpdates}
                    checked={state.settings.emailFeedUpdates}
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
                    // value={state.settings.notifyPostMentions}
                    checked={state.settings.notifyPostMentions}
                    onChange={updateState} />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailPostMentions'
                    name='emailPostMentions'
                    // value={state.settings.emailPostMentions}
                    checked={state.settings.emailPostMentions}
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
                    // value={state.settings.notifyCommentsOfYourPosts}
                    checked={state.settings.notifyCommentsOfYourPosts}
                    onChange={updateState} />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailCommentsOfYourPosts'
                    name='emailCommentsOfYourPosts'
                    // value={state.settings.emailCommentsOfYourPosts}
                    checked={state.settings.emailCommentsOfYourPosts}
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
                    // value={state.settings.notifyEventInvitations}
                    checked={state.settings.notifyEventInvitations}
                    onChange={updateState} />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailEventInvitations'
                    name='emailEventInvitations'
                    // value={state.settings.emailEventInvitations}
                    checked={state.settings.emailEventInvitations}
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
                    // value={state.settings.notifyWhenNewEventsAround}
                    checked={state.settings.notifyWhenNewEventsAround}
                    onChange={updateState} />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailWhenNewEventsAround'
                    name='emailWhenNewEventsAround'
                    // value={state.settings.emailWhenNewEventsAround}
                    checked={state.settings.emailWhenNewEventsAround}
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


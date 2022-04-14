import React, { useEffect } from 'react';
// import Chips from 'react-chips';
import { clone, useUpdate } from 'react-hook-core';
import ReactModal from 'react-modal';
import { useResource } from 'uione';
import imageOnline from '../assets/images/online.svg';
import GeneralInfo from './general-info';
import { Achievement, getMyProfileService, Skill, User } from './my-profile';

// const MAX_LOOK_UP = 40;
interface InternalState {
  message: string;
  isOpen: boolean;
  isEditing: boolean;
  isEditingBio: boolean;
  isEditingInterest: boolean;
  isEditingLookingFor: boolean;
  isEditingSkill: boolean;
  isEditingAchievement: boolean;
  bio: string;
  interest: string;
  lookingFor: string;
  skill: string;
  hireable: boolean;
  subject: string;
  description: string;
  highlight: boolean;
  user: User;
  objectUser: User;
  chipsSkill: string[];
  skillsList: string[];
  skills: Skill[];
  modalIsOpen: boolean;
}

const data: InternalState = {
  message: '',
  modalIsOpen: false,
  isOpen: false,
  isEditing: false,
  isEditingBio: false,
  isEditingInterest: false,
  isEditingLookingFor: false,
  isEditingSkill: false,
  isEditingAchievement: false,
  bio: '',
  interest: '',
  lookingFor: '',
  skill: '',
  hireable: false,
  subject: '',
  description: '',
  highlight: false,
  objectUser: {} as any,
  user: {} as any,
  chipsSkill: [],
  skillsList: [],
  skills: [],
}
export const MyProfileForm = () => {
  const resource = useResource();
  const { state, setState, updateState } = useUpdate<InternalState>(data);
  useEffect(() => {
    const id = 'XU3rkqafp';
    getMyProfileService().getMyProfile(id).then(user => {
      if (user) {
        setState({ user });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const closeModal = () => {
    setState({ modalIsOpen: false });
  }

  // private readonly skillService = applicationContext.getMyProfileService();
  // private readonly chipSkillSuggestionsService = new DefaultSuggestionService<any>(this.skillService, MAX_LOOK_UP, 'skill', 'skill');
  // /*
  //   initData() {
  //     zip(
  //         this.skillService.getAll1(),
  //     ).subscribe(([skills]) => {
  //       this.setState({skills}, () => {
  //         const promise = new Promise((resolve, reject) => {
  //           this.loadData();
  //           resolve('Success!');
  //         });
  //         promise.then(() => {
  //           const chipsSkill = this.state.skills.filter((skill) =>
  //               this.state.skillsList.includes(skill.skill));
  //           this.setState({chipsSkill});
  //         });
  //       });
  //     }, this.handleError);
  //   }
  //   onChangeSkillChips = chipsSkill => {
  //     // this.skillService.getAll1().subscribe(
  //     //     ( result: any ) => {
  //     //       this.setState({skills: result});
  //     //     });
  //     let { skillsList } = this.state;
  //     const { skills } = this.state;
  //     console.log('UUUU', skills);
  //     skillsList = [];
  //     chipsSkill.map((value, index) => {
  //       const x = skills.find((v) => v.skill === value.skill);
  //       skillsList.push(x.skill);
  //     });
  //     this.setState({ chipsSkill, skillsList });
  //   }

  //   fetchSuggestions = (keyWords) => {
  //     return new Promise((resolve, reject) => {
  //       const { skillsList, preSkillSuggestions } = this.state;
  //         this.chipSkillSuggestionsService.getSuggestion(keyWords, preSkillSuggestions, skillsList).subscribe(result => {
  //           const skill = keyWords;
  //           this.setState({ preSkillSuggestions: result.previousSuggestion , skill});
  //           resolve(result.response);
  //         });
  //     });
  //   }

  //   onRemoveChips = (id) => {
  //     let { skillsList, chipsSkill } = this.state;
  //     skillsList = skillsList.filter(skill => skill !== id);
  //      chipsSkill = chipsSkill.filter(chip => chip.skill !== id);
  //     this.setState({ skillsList, chipsSkill });
  //   }

  //   openSkillModal = () => {
  //     this.setState({ modalSkillIsOpen: true });
  //   }

  //   loadData() {
  //     const userId = storage.getUserId();
  //     applicationContext.getMyProfileService().getMyProfile(userId).subscribe((user: User) => {
  //       this.setState({ user, objectUser: ReflectionUtil.clone(user) });
  //     }, err => {
  //       UIUtil.alertError(ResourceManager.getString('error_load_user_profile'), ResourceManager.getString('error'));
  //     });
  //   }

  //   // loadData() {
  //   //   const userId = storage.getUserId();
  //   //   zip(
  //   //       this.skillService.getAll1(),
  //   //       applicationContext.getMyProfileService().getMyProfile(userId),
  //   //   ).subscribe(([skills, user]) => {
  //   //     this.setState({skills, user, objectUser: ReflectionUtil.clone(user)}, () => {
  //   //       const promise = new Promise((resolve, reject) => {
  //   //         this.loadData();
  //   //         resolve('Success!');
  //   //       });
  //   //       promise.then(() => {
  //   //         const chipsSkill = this.state.skills.filter((skill) =>
  //   //             this.state.skillsList.includes(skill.skill));
  //   //         this.setState({chipsSkill});
  //   //       });
  //   //     });
  //   //   }, this.handleError);
  //   // }


  //   showChangeStatus = () => {

  //   }

  //   showPopup = (e) => {
  //     e.preventDefault();
  //     this.setState({ modalIsOpen: true });
  //   }

  //   close = () => {
  //     const { isEditingBio, isEditingAchievement, isEditingInterest, isEditingSkill, isEditingLookingFor } = this.state;
  //     if (isEditingBio) {
  //       this.setState({ isEditingBio: !isEditingBio });
  //     }
  //     if (isEditingInterest) {
  //       this.setState({
  //         isEditingInterest: !isEditingInterest,
  //       });
  //     }
  //     if (isEditingLookingFor) {
  //       this.setState({
  //         lookingFor: '',
  //         isEditingLookingFor: !isEditingLookingFor
  //       });
  //     }
  //     if (isEditingSkill) {
  //       this.setState({
  //         skill: '',
  //         isEditingSkill: !isEditingSkill
  //       });
  //     }
  //     if (isEditingAchievement) {
  //       this.setState({
  //         subject: '',
  //         highlight: false,
  //         description: '',
  //         isEditingAchievement: !isEditingAchievement,
  //       });
  //     }
  //     this.setState({ isEditing: !this.state.isEditing });
  //   }

  //   // addSkill = (e) => {
  //   //   e.preventDefault();
  //   //   const { user, skill, hireable } = this.state;
  //   //   const skillsEditing = user.skills ? user.skills : [];
  //   //   if (skill && skill.trim() !== '') {
  //   //     console.log('OOOO', skillsEditing);
  //   //     const item = {
  //   //       hirable: hireable,
  //   //       skill
  //   //     };
  //   //     if (!this.isExistInArray(e, skillsEditing, item, 'skill')) {
  //   //       skillsEditing.push(item);
  //   //       user.skills = skillsEditing;
  //   //       this.setState({ skill: '', user });
  //   //     } else {
  //   //       UIUtil.alertError(ResourceManager.getString('error_duplicated_skill'), ResourceManager.getString('error'));
  //   //     }
  //   //   }
  //   // }
  //   addSkill = (e) => {
  //     e.preventDefault();
  //     this.onRemoveChips(this.state.skillsList[0]);
  //     const { user, hireable } = this.state;
  //     const skill = this.state.skillsList.length !== 0 ? this.state.skillsList[0] : this.state.skill;
  //     const skillsEditing = user.skills ? user.skills : [];
  //     if (skill) {
  //       const item = {
  //         hirable: hireable,
  //         skill
  //       };
  //       if (!this.isExistInArray(e, skillsEditing, item, 'skill')) {
  //         skillsEditing.push(item);
  //         user.skills = skillsEditing;
  //         this.setState({ skill: '', user });
  //       } else {
  //         UIUtil.alertError(ResourceManager.getString('error_duplicated_skill'), ResourceManager.getString('error'));
  //       }
  //     }
  //   }
  //   saveChanges = (event) => {
  //     event.preventDefault();
  //     const { isEditing } = this.state;
  //     if (isEditing) {
  //       applicationContext.getMyProfileService().saveMyProfile(storage.getUserId(), this.state.user).subscribe(successs => {
  //         if (successs) {
  //           this.initData();
  //           this.close();
  //           UIUtil.showToast(ResourceManager.getString('success_save_my_profile'));
  //         } else {
  //           UIUtil.alertError(ResourceManager.getString('fail_save_my_profile'), ResourceManager.getString('error'));
  //         }
  //       }, err => {
  //         UIUtil.alertError(ResourceManager.getString('fail_save_my_profile'), ResourceManager.getString('error'));
  //       });
  //     }
  //   }

  //   saveEmit = (rs) => {
  //     if (rs.status === 'success' && rs.data) {
  //       this.setState({ user: ReflectionUtil.clone(rs.data) });
  //       UIUtil.showToast(ResourceManager.getString('success_save_my_profile'));
  //     } else {
  //       UIUtil.alertError(ResourceManager.getString('fail_save_my_profile'), ResourceManager.getString('error'));
  //     }
  //   }
  // */
  const toggleBio = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setState({ isEditingBio: !state.isEditingBio, isEditing: !state.isEditing });
  }
  const editBio = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const { bio, user } = state;
    if (bio && bio.trim() !== '') {
      user.bio = bio;
      setState({ bio: '', user });
    }
  }
  const toggleLookingFor = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setState({ isEditingLookingFor: !state.isEditingLookingFor, isEditing: !state.isEditing });
  }
  const removeLookingFor = (e: React.MouseEvent<HTMLElement, MouseEvent>, lookingForContent: string) => {
    e.preventDefault();
    const { user } = state;
    user.lookingFor = user.lookingFor.filter(item => item !== lookingForContent);
    setState({ user });
  }
  const addLookingFor = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const { user, lookingFor } = state;
    const lookingForUser = user.lookingFor ? user.lookingFor : [];
    if (lookingFor && lookingFor.trim() !== '') {
      if (!inArray(lookingForUser, lookingFor)) {
        lookingForUser.push(lookingFor);
        user.lookingFor = lookingForUser;
        setState({ lookingFor: '', user });
      } else {
        // UIUtil.alertError(ResourceManager.getString('error_duplicated_looking_for'), ResourceManager.getString('error'));
      }
    }
  }
  const toggleInterest = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setState({ isEditingInterest: !state.isEditingInterest, isEditing: !state.isEditing });
  }
  const removeInterest = (e: React.MouseEvent<HTMLElement, MouseEvent>, subject: string) => {
    e.preventDefault();
    const { user } = state;
    if (user.interests) {
      const interests = user.interests.filter((item: string) => item !== subject);
      user.interests = interests;
      setState({ user });
    }
  }
  const addInterest = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const { interest, user } = state;
    const interests = user.interests ? user.interests : [];
    if (interest && interest.trim() !== '') {
      if (!inArray(interests, interest)) {
        interests.push(interest);
        user.interests = interests;
        setState({ interest: '', user });
      } else {
        // UIUtil.alertError(ResourceManager.getString('error_duplicated_interest'), ResourceManager.getString('error'));
      }
    }
  }
  const toggleSkill = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setState({ isEditingSkill: !state.isEditingSkill, isEditing: !state.isEditing });
  }
  const removeSkill = (e: React.MouseEvent<HTMLElement, MouseEvent>, skillContent: string) => {
    e.preventDefault();
    const { user } = state;
    user.skills = user.skills.filter(item => item['skill'] !== skillContent);
    setState({ user });
  }
  const toggleAchievement = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setState({ isEditingAchievement: !state.isEditingAchievement, isEditing: !state.isEditing });
  }
  const removeAchievement = (e: React.MouseEvent<HTMLElement, MouseEvent>, subject: string) => {
    e.preventDefault();
    const { user } = state;
    if (user.achievements) {
      const achievements = user.achievements.filter((item: Achievement) => item['subject'] !== subject);
      user.achievements = achievements;
      setState({ user });
    }
  }
  const addAchievement = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const { subject, description, highlight, user } = state;
    const achievement: Achievement = { subject, description, highlight };
    const achievements = user.achievements ? clone(user.achievements) : [];
    achievement.subject = subject;
    achievement.description = description;
    achievement.highlight = highlight;
    if (subject && subject.trim().length > 0 && !inAchievements(achievements, achievement)) {
      achievements.push(achievement);
      user.achievements = achievements;
      setState({ user, subject: '', description: '', highlight });
    }
  }


  const followers = '7 followers'; // StringUtil.format(ResourceManager.getString('user_profile_followers'), user.followerCount || 0);
  const following = '10 following'; // StringUtil.format(ResourceManager.getString('user_profile_following'), user.followingCount || 0);
  return (
    <div className='profile view-container'>
      <form id='userForm' name='userForm' >
        <header className='border-bottom-highlight'>
          <div className='cover-image'>
            <img src='https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg' alt='cover' />
            <div className='contact-group'>
              <button id='btnPhone' name='btnPhone' className='btn-phone' />
              <button id='btnEmail' name='btnEmail' className='btn-email' />
            </div>
            <button id='btnFollow' name='btnFollow' className='btn-follow'>Follow</button>
          </div>
          <button id='btnCamera' name='btnCamera' className='btn-camera' />
          <div className='avatar-wrapper'>
            <img className='avatar'
              src={state.user.image || 'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'} alt='avatar' />
            <img className='profile-status' src={imageOnline} alt='status' />
          </div>
          <div className='profile-title'>
            <h3>{state.user.displayName}</h3>
            <p>{state.user.website}</p>
          </div>
          <div className='profile-followers'>
            <p><i className='material-icons highlight'>group</i> {followers}</p>
            <p><i className='material-icons highlight'>group_add</i> {following}</p>
          </div>
        </header>
        <div className='row'>
          <div className='col m12 l4'>
            <div className='card'>
              <header>
                <i className='material-icons highlight'>account_box</i>
                {resource.user_profile_basic_info}
                <button type='button' id='btnBasicInfo' name='btnBasicInfo' hidden={state.isEditing} className='btn-edit' />
              </header>
              <p>{state.user.occupation}</p>
              <p>{state.user.company}</p>
            </div>
            {!state.isEditingSkill &&
              <div className='card'>
                <header>
                  <i className='material-icons highlight'>local_mall</i>
                  {resource.skills}
                  <button type='button' id='btnSkill' name='btnSkill' hidden={state.isEditing} className='btn-edit' onClick={toggleSkill} />
                </header>
                <section>
                  {
                    state.user.skills && state.user.skills.map((item: Skill, index: number) => {
                      return <p key={index}>{item.skill}<i hidden={!item.hirable} className='star highlight' /></p>;
                    })
                  }
                  <hr />
                  <p className='description'>
                    <i className='star highlight' />
                    {resource.user_profile_hireable_skill}
                  </p>
                </section>
              </div>
            }
            {state.isEditingSkill &&
              <div className='card'>
                <header>
                  <i className='material-icons highlight'>local_mall</i>
                  {resource.skills}
                  <button type='button' id='btnSkill' name='btnSkill' className='btn-close' onClick={toggleSkill} />
                </header>
                <section>
                  {
                    state.user.skills && state.user.skills.map((item: Skill, index: number) => {
                      return (
                        <div key={index} className='chip'>
                          {item.skill}
                          {item.hirable === true && <i className='star highlight' />}
                          <button type='button' name='btnRemoveSkill' className='close' onClick={(e) => removeSkill(e, item.skill)} />
                        </div>
                      );
                    })
                  }
                  {/*
                    <label className='form-group inline-input'>
                      <Chips
                          type='text' id='skill' name='skill'
                          value={chipsSkill}
                          onChange={this.onChangeSkillChips}
                          fetchSuggestions={(value) => this.fetchSuggestions(value)}
                          shouldRenderSuggestions={value => value.length >= 1}
                          renderChip={(item) => (
                              <div>
                                <div>{item.skill} <span onClick={() => this.onRemoveChips(item.skill)}>&times; &nbsp;</span></div>
                              </div>
                          )}
                          fromSuggestionsOnly={false}
                          renderSuggestion={(item, { query }) => (
                              <div
                                  key={item.skill}>
                                {item.skill}
                              </div>
                          )}
                          getSuggestionValue={suggestion => suggestion.skill}
                          placeholder={resource.placeholder_user_profile_skill}
                      />
                      <button type='button' id='btnAddSkill' name='btnAddSkill' className='btn-add' onClick={this.addSkill}/>
                    </label>*/}
                  <label className='checkbox-container'>
                    <input type='checkbox' id='hireable' name='hireable' checked={state.hireable} onChange={updateState} />
                    {resource.user_profile_hireable_skill}
                  </label>
                  <hr />
                  <p className='description'>
                    <i className='star highlight' />{resource.user_profile_hireable_skill}
                  </p>
                </section>
                <footer>
                  <button type='button' id='btnSaveSkill' name='btnSaveSkill'>
                    {resource.save}
                  </button>
                </footer>
              </div>
            }
            {
              !state.isEditingLookingFor &&
              <div className='card'>
                <header>
                  <i className='material-icons highlight'>find_in_page</i>
                  {resource.user_profile_looking_for}
                  <button type='button' id='btnLookingFor' name='btnLookingFor' hidden={state.isEditing && !state.isEditingLookingFor} className='btn-edit' onClick={toggleLookingFor} />
                </header>
                <section>
                  {
                    state.user.lookingFor && state.user.lookingFor.map((item: string, index: number) => {
                      return (<p key={index}>{item}</p>);
                    })
                  }
                </section>
              </div>
            }
            {state.isEditingLookingFor &&
              <div className='card'>
                <header>
                  <i className='material-icons highlight'>find_in_page</i>
                  {resource.user_profile_looking_for}
                  <button type='button' id='btnLookingFor' name='btnLookingFor' className='btn-close' onClick={toggleLookingFor} />
                </header>
                <section>
                  {
                    state.user.lookingFor && state.user.lookingFor.map((item: string, index: number) => {
                      return (<div key={index} className='chip' tabIndex={index}>
                        {item}
                        <button type='button' name='btnRemoveLookingFor' className='close' onClick={(e) => removeLookingFor(e, item)} />
                      </div>);
                    })
                  }
                  <label className='form-group inline-input'>
                    <input name='lookingFor' className='form-control'
                      value={state.lookingFor} onChange={updateState}
                      placeholder={resource.placeholder_user_profile_looking_for} maxLength={100} />
                    <button type='button' id='btnAddLookingFor' name='btnAddLookingFor' className='btn-add' />
                  </label>
                </section>
                <footer>
                  <button type='button' id='btnSaveLookingFor' name='btnSaveLookingFor' >
                    {resource.save}
                  </button>
                </footer>
              </div>
            }
            <div className='card'>
              <header>
                <i className='material-icons highlight'>chat</i>
                {resource.user_profile_social}
                <button type='button' id='btnSocial' name='btnSocial' hidden={state.isEditing} className='btn-edit' />
              </header>
              <div>
                {
                  state.user.facebookLink &&
                  <a href={'https://facebookcom/' + state.user.facebookLink} title='facebook' target='_blank' rel="noreferrer">
                    <i className='fa fa-facebook' />
                    <span>facebook</span>
                  </a>
                }
                {
                  state.user.skypeLink &&
                  <a href={'https://skype.com/' + state.user.skypeLink} title='Skype' target='_blank' rel="noreferrer">
                    <i className='fa fa-skype' />
                    <span>Skype</span>
                  </a>
                }
                {
                  state.user.twitterLink &&
                  <a href={'https://twitter.com/' + state.user.twitterLink} title='Twitter' target='_blank' rel="noreferrer">
                    <i className='fa fa-twitter' />
                    <span>Twitter</span>
                  </a>
                }
                {
                  state.user.instagramLink &&
                  <a href={'https://instagram.com/' + state.user.instagramLink} title='Instagram' target='_blank' rel="noreferrer">
                    <i className='fa fa-instagram' />
                    <span>Instagram</span>
                  </a>
                }
                {
                  state.user.linkedinLink &&
                  <a href={'https://linkedin.com/' + state.user.linkedinLink} title='Linked in' target='_blank' rel="noreferrer">
                    <i className='fa fa-linkedin' />
                    <span>Linked in</span>
                  </a>
                }
                {
                  state.user.googleLink &&
                  <a href={'https://plus.google.com/' + state.user.googleLink} title='Google' target='_blank' rel="noreferrer">
                    <i className='fa fa-google' />
                    <span>Google</span>
                  </a>
                }
                {
                  state.user.dribbbleLink &&
                  <a href={'https://dribbble.com/' + state.user.dribbbleLink} title='dribbble' target='_blank' rel="noreferrer">
                    <i className='fa fa-dribbble' />
                    <span>dribbble</span>
                  </a>
                }

                {
                  state.user.customLink01 &&
                  <a href={state.user.customLink01} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
                {
                  state.user.customLink02 &&
                  <a href={state.user.customLink02} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
                {
                  state.user.customLink03 && <a href={state.user.customLink03} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
                {
                  state.user.customLink04 && <a href={state.user.customLink04} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
                {
                  state.user.customLink05 && <a href={state.user.customLink05} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
                {
                  state.user.customLink06 && <a href={state.user.customLink06} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
                {
                  state.user.customLink07 && <a href={state.user.customLink07} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
                {
                  state.user.customLink08 && <a href={state.user.customLink08} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
              </div>
            </div>
          </div>
          <div className='col m12 l8'>
            <div className='card border-bottom-highlight'>
              <header>
                <i className='material-icons highlight'>person</i>
                {resource.user_profile_bio}
                <button type='button' id='btnBio' name='btnBio'
                  hidden={state.isEditing && !state.isEditingBio}
                  className={(!state.isEditingBio ? 'btn-edit' : 'btn-close')}
                  onClick={toggleBio} />
              </header>
              {!state.isEditingBio &&
                <p>{state.user.bio}</p>}
              {state.isEditingBio && <textarea name='bio' value={state.user.bio} />}
              {state.isEditingBio &&
                <footer>
                  <button type='button' id='btnSaveBio' name='btnSaveBio' >
                    {resource.save}
                  </button>
                </footer>
              }
            </div>
            <div className='card border-bottom-highlight'>
              <header>
                <i className='material-icons highlight'>flash_on</i>
                {resource.interests}
                <button type='button' id='btnInterest' name='btnInterest'
                  hidden={state.isEditing && !state.isEditingInterest}
                  className={(!state.isEditingInterest ? 'btn-edit' : 'btn-close')}
                  onClick={toggleInterest}
                />
              </header>
              {!state.isEditingInterest &&
                <section className='row'>
                  {
                    state.user.interests && state.user.interests.map((item: string, index: number) => {
                      return (<span key={index} className='col s4'>{item}</span>);
                    })
                  }
                </section>
              }
              {state.isEditingInterest &&
                <section className='row'>
                  {state.user.interests && state.user.interests.map((item: string, index: number) => {
                    return (<div key={index} className='chip' tabIndex={index}>{item}
                      <button type='button' name='btnRemoveInterest' className='close' onClick={(e) => removeInterest(e, item)} />
                    </div>);
                  })
                  }
                  <label className='col s12 inline-input'>
                    <input type='text' name='interest' onChange={updateState}
                      placeholder={resource.placeholder_user_profile_interest} value={state.interest} maxLength={100} />
                    <button type='button' id='btnAddInterest' name='btnAddInterest' className='btn-add' />
                  </label>
                </section>
              }
              {state.isEditingInterest &&
                <footer>
                  <button type='button' id='btnSaveInterest' name='btnSaveInterest' >
                    {resource.save}
                  </button>
                </footer>}
            </div>

            <div className='card border-bottom-highlight'>
              <header>
                <i className='material-icons highlight'>beenhere</i>
                {resource.achievements}
                <button type='button' id='btnAchievement' name='btnAchievement'
                  hidden={state.isEditing && !state.isEditingAchievement}
                  className={!state.isEditingAchievement ? 'btn-edit' : 'btn-close'}
                  onClick={toggleAchievement}
                />
              </header>
              {
                !state.isEditingAchievement && state.user.achievements && state.user.achievements.map((achievement: Achievement, index: number) => {
                  return <section key={index}>
                    <h3>{achievement.subject}
                      {achievement.highlight && <i className='star highlight float-right' />}
                    </h3>
                    <p className='description'>{achievement.description}</p>
                    <hr />
                  </section>;
                })
              }
              {
                state.isEditingAchievement && state.user.achievements && state.user.achievements.map((achievement: Achievement, index: number) => {
                  return <section key={index}>
                    <h3>{achievement.subject}
                      {achievement.highlight && <i className='star highlight' />}
                    </h3>
                    <p className='description'>{achievement.description}</p>
                    <button type='button' className='btn-remove' onClick={(e) => removeAchievement(e, achievement.subject)} />
                    <hr />
                  </section>;
                })
              }
              {state.isEditingAchievement &&
                <section>
                  <div className='form-group'>
                    <input type='text' name='subject' className='form-control'
                      value={state.subject} onChange={updateState}
                      placeholder={resource.placeholder_user_profile_achievement_subject}
                      maxLength={50} required={true} />
                    <input type='text' name='description' className='form-control'
                      value={state.description} onChange={updateState}
                      placeholder={resource.placeholder_user_profile_achievement_description}
                      maxLength={100} required={true} />
                  </div>
                  <label className='checkbox-container'>
                    <input type='checkbox' id='highlight' name='highlight'
                      checked={state.highlight} onChange={updateState} />
                    {resource.user_profile_highlight_achievement}
                  </label>
                  <div className='btn-group'>
                    <button type='button' id='btnAddAchievement' name='btnAddAchievement' className='btn-add' />
                    {resource.button_add_achievement}
                  </div>
                </section>
              }
              {state.isEditingAchievement &&
                <footer>
                  <button type='button' id='btnSaveAchievement' name='btnSaveAchievement' >
                    {resource.save}
                  </button>
                </footer>
              }
            </div>
          </div>
        </div>
      </form>
      <ReactModal
        isOpen={state.modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Modal'
        // portalClassName='modal-portal'
        className='modal-portal-content'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'
      >
        <GeneralInfo
          resource={resource}
          close={closeModal}
          user={state.user} />
      </ReactModal>
    </div>
  );

}
export function inArray(arr: string[], item: string): boolean {
  if (!arr || arr.length === 0) {
    return false;
  }
  const isExist = arr.filter(itemFilter => itemFilter === item).length > 0;
  return isExist;
}

export function inAchievements(arr: Achievement[], item: Achievement): boolean {
  if (!arr || arr.length === 0) {
    return false;
  }
  const isExist = arr.filter(itemFilter => itemFilter.subject === item.subject).length > 0;
  return isExist;
}

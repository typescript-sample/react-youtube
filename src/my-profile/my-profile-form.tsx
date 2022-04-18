import React, { useEffect, useState } from 'react';
// import Chips from 'react-chips';
import { clone, OnClick, useUpdate } from 'react-hook-core';
import ReactModal from 'react-modal';
import { useResource } from 'uione';
import imageOnline from '../assets/images/online.svg';
import GeneralInfo from './general-info';
import { Achievement, useGetMyProfileService, Skill, User } from './my-profile';

// const MAX_LOOK_UP = 40;


interface Edit {
  edit: {
    hireable: boolean;
    lookingFor: string;
    interest: string;
    highlight: boolean;
    description: string;
    subject: string;
    skill: string;
    hirable: boolean;
  }
}
const data: Edit = {
  edit: {
    hireable: false,
    lookingFor: '',
    interest: '',
    highlight: false,
    description: '',
    subject: '',
    skill: '',
    hirable: false
  }
}
export const MyProfileForm = () => {
  const service = useGetMyProfileService()
  const { state, setState, updateState } = useUpdate<Edit>(data, 'edit');

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [isEditingInterest, setIsEditingInterest] = useState<boolean>(false);
  const [isEditingLookingFor, setIsEditingLookingFor] = useState<boolean>(false);
  const [isEditingSkill, setIsEditingSkill] = useState<boolean>(false);
  const [isEditingAchievement, setIsEditingAchievement] = useState<boolean>(false);
  const [bio, setBio] = useState<string>('');
  const [user, setUser] = useState<User>({} as any);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalConfirmIsOpen, setModalConfirmIsOpen] = useState<boolean>(false)
  const resource = useResource();

  useEffect(() => {
    const id = 'XU3rkqafp';
    service.getMyProfile(id).then(user => {
      if (user) {
        console.log('user', user)
        setUser(user);
        setBio(user.bio || '')
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const closeModal = () => {
    setModalIsOpen(false)
  }

  // private readonly skillService = applicationContext.useGetMyProfileService();
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

  // fetchSuggestions = (keyWords) => {
  //   return new Promise((resolve, reject) => {
  //     const { skillsList, preSkillSuggestions } = this.state;
  //       this.chipSkillSuggestionsService.getSuggestion(keyWords, preSkillSuggestions, skillsList).subscribe(result => {
  //         const skill = keyWords;
  //         this.setState({ preSkillSuggestions: result.previousSuggestion , skill});
  //         resolve(result.response);
  //       });
  //   });
  // }

  // onRemoveChips = (id:string) => {
  //   let { skillsList, chipsSkill } = this.state;
  //   skillsList = skillsList.filter(skill => skill !== id);
  //    chipsSkill = chipsSkill.filter(chip => chip.skill !== id);
  //   this.setState({ skillsList, chipsSkill });
  // }

  //   openSkillModal = () => {
  //     this.setState({ modalSkillIsOpen: true });
  //   }

  //   loadData() {
  //     const userId = storage.getUserId();
  //     applicationContext.useGetMyProfileService().getMyProfile(userId).subscribe((user: User) => {
  //       this.setState({ user, objectUser: ReflectionUtil.clone(user) });
  //     }, err => {
  //       UIUtil.alertError(ResourceManager.getString('error_load_user_profile'), ResourceManager.getString('error'));
  //     });
  //   }

  //   // loadData() {
  //   //   const userId = storage.getUserId();
  //   //   zip(
  //   //       this.skillService.getAll1(),
  //   //       applicationContext.useGetMyProfileService().getMyProfile(userId),
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

  const showPopup = (e: OnClick) => {
    e.preventDefault();
    setModalIsOpen(true)
  }

  const close = () => {
    if (isEditingBio) {
      setIsEditingBio(!isEditingBio)
    }
    if (isEditingInterest) {
      setIsEditingInterest(!isEditingInterest)
    }
    if (isEditingLookingFor) {
      setIsEditingLookingFor(!isEditingLookingFor)
    }
    if (isEditingSkill) {
      setState({ edit: { ...state.edit, skill: '' } })
      setIsEditingSkill(!isEditingSkill)
    }
    if (isEditingAchievement) {
      setState({ edit: { ...state.edit, subject: '', highlight: false, description: '' } })
      setIsEditingAchievement(!isEditingAchievement)
    }
    setIsEditing(!isEditing)
  }

  const addSkill = (e: OnClick) => {
    e.preventDefault();
    const { skill, hireable } = state.edit;
    const skillsEditing = user.skills ? user.skills : [];
    if (skill && skill.trim() !== '') {
      const item = {
        hirable: hireable,
        skill
      };
      if (skillsEditing.filter(skillEdit => skillEdit.skill === skill).length === 0) {
        skillsEditing.push(item);
        user.skills = skillsEditing;
        setState({ edit: { ...state.edit, skill: '' } })
        setUser({ ...user })
      } else {
        console.log(resource.error_duplicated_skill)
      }
    }
  }
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
  const saveChanges = (event: OnClick) => {
    event.preventDefault();
    if (isEditing) {
      service.saveMyProfile(user).then(successs => {
        if (successs) {
          // this.initData();
          close();
          // UIUtil.showToast(ResourceManager.getString('success_save_my_profile'));
          console.log('success')
        } else {
          console.log('fail')
          // UIUtil.alertError(ResourceManager.getString('fail_save_my_profile'), ResourceManager.getString('error'));
        }
      });
    }
  }

  const saveEmit = (rs: any) => {
    if (rs.status === 'success' && rs.user) {
      // this.setState({ user:rs.data });
      setUser(rs.user)
      console.log(resource.success_save_my_profile)
    } else {
      console.log(resource.fail_save_my_profile)
    }
  }

  const toggleBio = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    if (user.bio !== bio) {
      setModalConfirmIsOpen(true)
    } else {
      setIsEditingBio(!isEditingBio)
      setIsEditing(!isEditing)
    }
  }

  const revertBioChages = () => {
    setUser({ ...user, bio })
    setIsEditingBio(!isEditingBio)
    setIsEditing(!isEditing)
    setModalConfirmIsOpen(false)
  }
  const editBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const data = e.target.value;
    setUser({ ...user, bio: data })
  }
  const toggleLookingFor = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setIsEditingLookingFor(!isEditingLookingFor)
    setIsEditing(!isEditing)
  }
  const removeLookingFor = (e: React.MouseEvent<HTMLElement, MouseEvent>, lookingForContent: string) => {
    e.preventDefault();
    user.lookingFor = user.lookingFor.filter(item => item !== lookingForContent);
    setUser({ ...user })
  }
  const addLookingFor = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const lookingForUser = user.lookingFor ? user.lookingFor : [];
    if (state.edit.lookingFor && state.edit.lookingFor.trim() !== '') {
      if (!inArray(lookingForUser, state.edit.lookingFor)) {
        lookingForUser.push(state.edit.lookingFor);
        user.lookingFor = lookingForUser;
        setState({ edit: { ...state.edit, lookingFor: '' } })
        setUser({ ...user })
      } else {
        // UIUtil.alertError(ResourceManager.getString('error_duplicated_looking_for'), ResourceManager.getString('error'));
      }
    }
  }
  const toggleInterest = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setIsEditingInterest(!isEditingInterest)
    setIsEditing(!isEditing)
  }
  const removeInterest = (e: React.MouseEvent<HTMLElement, MouseEvent>, subject: string) => {
    e.preventDefault();
    if (user.interests) {
      const interests = user.interests.filter((item: string) => item !== subject);
      user.interests = interests;
      setUser({ ...user })
    }
  }
  const addInterest = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const interests = user.interests ? user.interests : [];
    if (state.edit.interest && state.edit.interest.trim() !== '') {
      if (!inArray(interests, state.edit.interest)) {
        interests.push(state.edit.interest);
        user.interests = interests;
        setUser({ ...user })
        setState({ edit: { ...state.edit, interest: '' } })
      } else {
        // UIUtil.alertError(ResourceManager.getString('error_duplicated_interest'), ResourceManager.getString('error'));
      }
    }
  }
  const toggleSkill = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setIsEditingSkill(!isEditingSkill)
    setIsEditing(!isEditing)
  }
  const removeSkill = (e: React.MouseEvent<HTMLElement, MouseEvent>, skillContent: string) => {
    e.preventDefault();
    user.skills = user.skills.filter(item => item['skill'] !== skillContent);
    setUser({ ...user })
    setState({ edit: { ...state.edit, interest: '' } })
  }
  const toggleAchievement = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setIsEditing(!isEditing)
    setIsEditingAchievement(!isEditingAchievement)

  }
  const removeAchievement = (e: React.MouseEvent<HTMLElement, MouseEvent>, subject: string) => {
    if (user.achievements) {
      const achievements = user.achievements.filter((item: Achievement) => item['subject'] !== subject);
      user.achievements = achievements;
      setUser({ ...user })
    }
  }
  const addAchievement = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const achievement: Achievement = { subject: state.edit.subject, description: state.edit.description, highlight: state.edit.highlight };
    const achievements = user.achievements ? clone(user.achievements) : [];
    achievement.subject = state.edit.subject;
    achievement.description = state.edit.description;
    achievement.highlight = state.edit.highlight;
    debugger
    if (state.edit.subject && state.edit.subject.trim().length > 0 && !inAchievements(achievements, achievement)) {
      achievements.push(achievement);
      user.achievements = achievements;
      setUser({ ...user })
      setState({ edit: { ...state.edit, description: '', subject: '' } })
    }
  }

  const closeModalConfirm = () => {
    setModalConfirmIsOpen(false)
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
              src={user.image || 'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'} alt='avatar' />
            <img className='profile-status' src={imageOnline} alt='status' />
          </div>
          <div className='profile-title'>
            <h3>{user.displayName}</h3>
            <p>{user.website}</p>
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
                <button type='button' id='btnBasicInfo' name='btnBasicInfo' hidden={isEditing} className='btn-edit' onClick={showPopup} />
              </header>
              <p>{user.occupation}</p>
              <p>{user.company}</p>
            </div>
            {!isEditingSkill &&
              <div className='card'>
                <header>
                  <i className='material-icons highlight'>local_mall</i>
                  {resource.skills}
                  <button type='button' id='btnSkill' name='btnSkill' hidden={isEditing} className='btn-edit' onClick={toggleSkill} />
                </header>
                <section>
                  {
                    user.skills && user.skills.map((item: Skill, index: number) => {
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
            {isEditingSkill &&
              <div className='card'>
                <header>
                  <i className='material-icons highlight'>local_mall</i>
                  {resource.skills}
                  <button type='button' id='btnSkill' name='btnSkill' className='btn-close' onClick={toggleSkill} />
                </header>
                <section>
                  {
                    user.skills && user.skills.map((item: Skill, index: number) => {
                      return (
                        <div key={index} className='chip'>
                          {item.skill}
                          {item.hirable === true && <i className='star highlight' />}
                          <button type='button' name='btnRemoveSkill' className='close' onClick={(e) => removeSkill(e, item.skill)} />
                        </div>
                      );
                    })
                  }

                  <section>
                    <div className='form-group'>
                      <input type='text' name='skill' className='form-control'
                        value={state.edit.skill} onChange={updateState}
                        placeholder={resource.placeholder_user_profile_skill}
                        maxLength={50} required={true} />

                    </div>
                    <div className='btn-group'>
                      <button type='button' id='btnAddAchievement' name='btnAddAchievement' className='btn-add' onClick={addSkill} />
                      {resource.button_add_achievement}
                    </div>
                  </section>
                  <label className='checkbox-container'>
                    <input type='checkbox' id='hireable' name='hireable' checked={state.edit.hireable} onChange={updateState} />
                    {resource.user_profile_hireable_skill}
                  </label>
                  <hr />
                  <p className='description'>
                    <i className='star highlight' />{resource.user_profile_hireable_skill}
                  </p>
                </section>
                <footer>
                  <button type='button' id='btnSaveSkill' name='btnSaveSkill' onClick={saveChanges}>
                    {resource.save}
                  </button>
                </footer>
              </div>
            }
            {
              !isEditingLookingFor &&
              <div className='card'>
                <header>
                  <i className='material-icons highlight'>find_in_page</i>
                  {resource.user_profile_looking_for}
                  <button type='button' id='btnLookingFor' name='btnLookingFor' hidden={isEditing && !isEditingLookingFor} className='btn-edit' onClick={toggleLookingFor} />
                </header>
                <section>
                  {
                    user.lookingFor && user.lookingFor.map((item: string, index: number) => {
                      return (<p key={index}>{item}</p>);
                    })
                  }
                </section>
              </div>
            }
            {isEditingLookingFor &&
              <div className='card'>
                <header>
                  <i className='material-icons highlight'>find_in_page</i>
                  {resource.user_profile_looking_for}
                  <button type='button' id='btnLookingFor' name='btnLookingFor' className='btn-close' onClick={toggleLookingFor} />
                </header>
                <section>
                  {
                    user.lookingFor && user.lookingFor.map((item: string, index: number) => {
                      return (<div key={index} className='chip' tabIndex={index}>
                        {item}
                        <button type='button' name='btnRemoveLookingFor' className='close' onClick={(e) => removeLookingFor(e, item)} />
                      </div>);
                    })
                  }
                  <label className='form-group inline-input'>
                    <input name='lookingFor' className='form-control'
                      value={state.edit.lookingFor} onChange={updateState}
                      placeholder={resource.placeholder_user_profile_looking_for} maxLength={100} />
                    <button type='button' id='btnAddLookingFor' name='btnAddLookingFor' className='btn-add' onClick={addLookingFor} />
                  </label>
                </section>
                <footer>
                  <button type='button' id='btnSaveLookingFor' name='btnSaveLookingFor' onClick={saveChanges}>
                    {resource.save}
                  </button>
                </footer>
              </div>
            }
            <div className='card'>
              <header>
                <i className='material-icons highlight'>chat</i>
                {resource.user_profile_social}
                <button type='button' id='btnSocial' name='btnSocial' hidden={isEditing} className='btn-edit' onClick={showPopup} />
              </header>
              <div>
                {
                  user.facebookLink &&
                  <a href={'https://facebookcom/' + user.facebookLink} title='facebook' target='_blank' rel="noreferrer">
                    <i className='fa fa-facebook' />
                    <span>facebook</span>
                  </a>
                }
                {
                  user.skypeLink &&
                  <a href={'https://skype.com/' + user.skypeLink} title='Skype' target='_blank' rel="noreferrer">
                    <i className='fa fa-skype' />
                    <span>Skype</span>
                  </a>
                }
                {
                  user.twitterLink &&
                  <a href={'https://twitter.com/' + user.twitterLink} title='Twitter' target='_blank' rel="noreferrer">
                    <i className='fa fa-twitter' />
                    <span>Twitter</span>
                  </a>
                }
                {
                  user.instagramLink &&
                  <a href={'https://instagram.com/' + user.instagramLink} title='Instagram' target='_blank' rel="noreferrer">
                    <i className='fa fa-instagram' />
                    <span>Instagram</span>
                  </a>
                }
                {
                  user.linkedinLink &&
                  <a href={'https://linkedin.com/' + user.linkedinLink} title='Linked in' target='_blank' rel="noreferrer">
                    <i className='fa fa-linkedin' />
                    <span>Linked in</span>
                  </a>
                }
                {
                  user.googleLink &&
                  <a href={'https://plus.google.com/' + user.googleLink} title='Google' target='_blank' rel="noreferrer">
                    <i className='fa fa-google' />
                    <span>Google</span>
                  </a>
                }
                {
                  user.dribbbleLink &&
                  <a href={'https://dribbble.com/' + user.dribbbleLink} title='dribbble' target='_blank' rel="noreferrer">
                    <i className='fa fa-dribbble' />
                    <span>dribbble</span>
                  </a>
                }

                {
                  user.customLink01 &&
                  <a href={user.customLink01} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
                {
                  user.customLink02 &&
                  <a href={user.customLink02} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
                {
                  user.customLink03 && <a href={user.customLink03} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
                {
                  user.customLink04 && <a href={user.customLink04} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
                {
                  user.customLink05 && <a href={user.customLink05} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
                {
                  user.customLink06 && <a href={user.customLink06} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
                {
                  user.customLink07 && <a href={user.customLink07} target='_blank' rel="noreferrer">
                    <i className='fab fa-globe-asia' />
                  </a>
                }
                {
                  user.customLink08 && <a href={user.customLink08} target='_blank' rel="noreferrer">
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
                  hidden={isEditing && !isEditingBio}
                  className={(!isEditingBio ? 'btn-edit' : 'btn-close')}
                  onClick={toggleBio} />
              </header>
              {!isEditingBio &&
                <p>{user.bio}</p>}
              {isEditingBio && <textarea name='bio' value={user.bio} onChange={editBio} />}
              {isEditingBio &&
                <footer>
                  <button type='button' id='btnSaveBio' name='btnSaveBio' onClick={e => { saveChanges(e); setBio(user.bio || '') }}>
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
                  hidden={isEditing && !isEditingInterest}
                  className={(!isEditingInterest ? 'btn-edit' : 'btn-close')}
                  onClick={toggleInterest}
                />
              </header>
              {!isEditingInterest &&
                <section className='row'>
                  {
                    user.interests && user.interests.map((item: string, index: number) => {
                      return (<span key={index} className='col s4'>{item}</span>);
                    })
                  }
                </section>
              }
              {isEditingInterest &&
                <section className='row'>
                  {user.interests && user.interests.map((item: string, index: number) => {
                    return (<div key={index} className='chip' tabIndex={index}>{item}
                      <button type='button' name='btnRemoveInterest' className='close' onClick={(e) => removeInterest(e, item)} />
                    </div>);
                  })
                  }
                  <label className='col s12 inline-input'>
                    <input type='text' name='interest' onChange={updateState}
                      placeholder={resource.placeholder_user_profile_interest} value={state.edit.interest} maxLength={100} />
                    <button type='button' id='btnAddInterest' name='btnAddInterest' className='btn-add' onClick={addInterest} />
                  </label>
                </section>
              }
              {isEditingInterest &&
                <footer>
                  <button type='button' id='btnSaveInterest' name='btnSaveInterest' onClick={saveChanges}>
                    {resource.save}
                  </button>
                </footer>}
            </div>

            <div className='card border-bottom-highlight'>
              <header>
                <i className='material-icons highlight'>beenhere</i>
                {resource.achievements}
                <button type='button' id='btnAchievement' name='btnAchievement'
                  hidden={isEditing && !isEditingAchievement}
                  className={!isEditingAchievement ? 'btn-edit' : 'btn-close'}
                  onClick={toggleAchievement}
                />
              </header>
              {
                (!isEditingAchievement && user.achievements) && user.achievements.map((achievement: Achievement, index: number) => {
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
                (isEditingAchievement && user.achievements) && user.achievements.map((achievement: Achievement, index: number) => (
                  <section key={index}>
                    <h3>{achievement.subject}
                      {achievement.highlight && <i className='star highlight' />}
                    </h3>
                    <p className='description'>{achievement.description}</p>
                    <button type='button' className='btn-remove' onClick={(e) => removeAchievement(e, achievement.subject)} />
                    <hr />
                  </section>
                ))
              }
              {isEditingAchievement &&
                <section>
                  <div className='form-group'>
                    <input type='text' name='subject' className='form-control'
                      value={state.edit.subject} onChange={updateState}
                      placeholder={resource.placeholder_user_profile_achievement_subject}
                      maxLength={50} required={true} />
                    <input type='text' name='description' className='form-control'
                      value={state.edit.description} onChange={updateState}
                      placeholder={resource.placeholder_user_profile_achievement_description}
                      maxLength={100} required={true} />
                  </div>
                  <label className='checkbox-container'>
                    <input type='checkbox' id='highlight' name='highlight'
                      checked={state.edit.highlight} onChange={updateState} />
                    {resource.user_profile_highlight_achievement}
                  </label>
                  <div className='btn-group'>
                    <button type='button' id='btnAddAchievement' name='btnAddAchievement' className='btn-add' onClick={addAchievement} />
                    {resource.button_add_achievement}
                  </div>
                </section>
              }
              {isEditingAchievement &&
                <footer>
                  <button type='button' id='btnSaveAchievement' name='btnSaveAchievement' onClick={saveChanges}>
                    {resource.save}
                  </button>
                </footer>
              }
            </div>
          </div>
        </div>
      </form>
      <ReactModal
        isOpen={modalIsOpen}
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
          saveEmit={saveEmit}
          user={user} />
      </ReactModal>
      <ReactModal
        isOpen={modalConfirmIsOpen}
        onRequestClose={closeModalConfirm}
        contentLabel='Modal'
        // portalClassName='modal-portal'
        className='modal-portal-content small-width-height'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'
      >
        <div className='view-container profile-info'>
          <form model-name='data'>
            <header>
              <h2>{resource.user_profile_general_info}</h2>
              <button type='button' id='btnClose' name='btnClose' className='btn-close' onClick={closeModalConfirm} />
            </header>
            <div>
              <section className='row'>
                <div>  Data will not be saved, are you sure to continue?</div>
              </section>
            </div>

            <footer>
              <button type='button' id='btnSave' name='btnSave' onClick={revertBioChages}>
                OK
              </button>
            </footer>
          </form>
        </div>
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

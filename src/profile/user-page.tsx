import { useEffect, useRef, useState } from 'react';
import { useResource } from 'uione';
import imageOnline from '../assets/images/online.svg';
import { getMyProfileService, User } from './user';

// interface InternalState {
//   user: User;
// }

// export class UserPage extends BaseComponent<any, InternalState> {
//   constructor(props: any) {
//     super(props);
//     this.state = {
//       user: {} as any
//     };
//   }
//   componentDidMount() {
//     const id = 'XU3rkqafp';
//     getMyProfileService().getMyProfile(id).then(user => {
//       if (user) {
//         this.setState({ user });
//       }
//     });
//   }
//   render() {
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     const resource = useResource();
//     const { user } = this.state;
//     const followers = '7 followers';
//     const following = '10 following';
//     return (
//       <div className='profile view-container'>
//         <form id='userForm' name='userForm' ref='form'>
//           <header className='border-bottom-highlight'>
//             <div className='cover-image'>
//               <img src='https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg' alt='cover' />
//               <div className='contact-group'>
//                 <button id='btnPhone' name='btnPhone' className='btn-phone' />
//                 <button id='btnEmail' name='btnEmail' className='btn-email' />
//               </div>
//               <button id='btnFollow' name='btnFollow' className='btn-follow'>Follow</button>
//             </div>
//             <button id='btnCamera' name='btnCamera' className='btn-camera' />
//             <div className='avatar-wrapper'>
//               <img className='avatar'
//                 src={user.image || 'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'} alt='avatar' />
//               <img className='profile-status' src={imageOnline} alt='status' />
//             </div>
//             <div className='profile-title'>
//               <h3>{user.displayName}</h3>
//               <p>{user.website}</p>
//             </div>
//             <div className='profile-followers'>
//               <p><i className='material-icons highlight'>group</i> {followers}</p>
//               <p><i className='material-icons highlight'>group_add</i> {following}</p>
//             </div>
//           </header>
//           <div className='row'>
//             <div className='col m12 l4'>
//               <div className='card'>
//                 <header>
//                   <i className='material-icons highlight'>account_box</i>
//                   {resource.user_profile_basic_info}
//                 </header>
//                 <p>{user.occupation}</p>
//                 <p>{user.company}</p>
//               </div>
//               <div className='card'>
//                 <header>
//                   <i className='material-icons highlight'>local_mall</i>
//                   {resource.skills}
//                 </header>
//                 <section>
//                   {
//                     user.skills && user.skills.map((item, index) => {
//                       return <p key={index}>{item.skill}<i hidden={!item.hirable} className='star highlight' /></p>;
//                     })
//                   }
//                   <hr />
//                   <p className='description'>
//                     <i className='star highlight' />
//                     {resource.user_profile_hireable_skill}
//                   </p>
//                 </section>
//               </div>
//               <div className='card'>
//                 <header>
//                   <i className='material-icons highlight'>find_in_page</i>
//                   {resource.user_profile_looking_for}
//                 </header>
//                 <section>
//                   {
//                     user.lookingFor && user.lookingFor.map((item, index) => {
//                       return (<p key={index}>{item}</p>);
//                     })
//                   }
//                 </section>
//               </div>
//               <div className='card'>
//                 <header>
//                   <i className='material-icons highlight'>chat</i>
//                   {resource.user_profile_social}
//                 </header>
//                 <div>
//                   {
//                     user.facebookLink &&
//                     <a href={'https://facebookcom/' + user.facebookLink} title='facebook' target='_blank'>
//                       <i className='fa fa-facebook' />
//                       <span>facebook</span>
//                     </a>
//                   }
//                   {
//                     user.skypeLink &&
//                     <a href={'https://skype.com/' + user.skypeLink} title='Skype' target='_blank'>
//                       <i className='fa fa-skype' />
//                       <span>Skype</span>
//                     </a>
//                   }
//                   {
//                     user.twitterLink &&
//                     <a href={'https://twitter.com/' + user.twitterLink} title='Twitter' target='_blank'>
//                       <i className='fa fa-twitter' />
//                       <span>Twitter</span>
//                     </a>
//                   }
//                   {
//                     user.instagramLink &&
//                     <a href={'https://instagram.com/' + user.instagramLink} title='Instagram' target='_blank'>
//                       <i className='fa fa-instagram' />
//                       <span>Instagram</span>
//                     </a>
//                   }
//                   {
//                     user.linkedinLink &&
//                     <a href={'https://linkedin.com/' + user.linkedinLink} title='Linked in' target='_blank'>
//                       <i className='fa fa-linkedin' />
//                       <span>Linked in</span>
//                     </a>
//                   }
//                   {
//                     user.googleLink &&
//                     <a href={'https://plus.google.com/' + user.googleLink} title='Google' target='_blank'>
//                       <i className='fa fa-google' />
//                       <span>Google</span>
//                     </a>
//                   }
//                   {
//                     user.dribbbleLink &&
//                     <a href={'https://dribbble.com/' + user.dribbbleLink} title='dribbble' target='_blank'>
//                       <i className='fa fa-dribbble' />
//                       <span>dribbble</span>
//                     </a>
//                   }

//                   {
//                     user.customLink01 &&
//                     <a href={user.customLink01} target='_blank'>
//                       <i className='fab fa-globe-asia' />
//                     </a>
//                   }
//                   {
//                     user.customLink02 &&
//                     <a href={user.customLink02} target='_blank'>
//                       <i className='fab fa-globe-asia' />
//                     </a>
//                   }
//                   {
//                     user.customLink03 && <a href={user.customLink03} target='_blank'>
//                       <i className='fab fa-globe-asia' />
//                     </a>
//                   }
//                   {
//                     user.customLink04 && <a href={user.customLink04} target='_blank'>
//                       <i className='fab fa-globe-asia' />
//                     </a>
//                   }
//                   {
//                     user.customLink05 && <a href={user.customLink05} target='_blank'>
//                       <i className='fab fa-globe-asia' />
//                     </a>
//                   }
//                   {
//                     user.customLink06 && <a href={user.customLink06} target='_blank'>
//                       <i className='fab fa-globe-asia' />
//                     </a>
//                   }
//                   {
//                     user.customLink07 && <a href={user.customLink07} target='_blank'>
//                       <i className='fab fa-globe-asia' />
//                     </a>
//                   }
//                   {
//                     user.customLink08 && <a href={user.customLink08} target='_blank'>
//                       <i className='fab fa-globe-asia' />
//                     </a>
//                   }
//                 </div>
//               </div>
//             </div>
//             <div className='col m12 l8'>
//               <div className='card border-bottom-highlight'>
//                 <header>
//                   <i className='material-icons highlight'>person</i>
//                   {resource.user_profile_bio}
//                 </header>
//                 <p>{user.bio}</p>
//               </div>
//               <div className='card border-bottom-highlight'>
//                 <header>
//                   <i className='material-icons highlight'>flash_on</i>
//                   {resource.interests}
//                 </header>
//                 <section className='row'>
//                   {
//                     user.interests && user.interests.map((item, index) => {
//                       return (<span key={index} className='col s4'>{item}</span>);
//                     })
//                   }
//                 </section>
//               </div>

//               <div className='card border-bottom-highlight'>
//                 <header>
//                   <i className='material-icons highlight'>beenhere</i>
//                   {resource.achievements}
//                 </header>
//                 {
//                   user.achievements && user.achievements.map((achievement, index) => {
//                     return <section key={index}>
//                       <h3>{achievement.subject}
//                         {achievement.highlight && <i className='star highlight float-right' />}
//                       </h3>
//                       <p className='description'>{achievement.description}</p>
//                       <hr />
//                     </section>;
//                   })
//                 }
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     );
//   }
// }

export function UserPage() {
  const id = 'XU3rkqafp';
  const [user, setUser] = useState<User>({} as User);
  const refForm = useRef();
  useEffect(() => {
    getMyProfileService().getMyProfile(id).then(user => {
      if (user) {
        setUser(user);
      }
    });
  },[])
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const resource = useResource();
  const followers = '7 followers';
  const following = '10 following';
  return (
    <div className='profile view-container'>
      <form id='userForm' name='userForm' ref={refForm as any}>
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
              </header>
              <p>{user.occupation}</p>
              <p>{user.company}</p>
            </div>
            <div className='card'>
              <header>
                <i className='material-icons highlight'>local_mall</i>
                {resource.skills}
              </header>
              <section>
                {
                  user.skills && user.skills.map((item, index) => {
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
            <div className='card'>
              <header>
                <i className='material-icons highlight'>find_in_page</i>
                {resource.user_profile_looking_for}
              </header>
              <section>
                {
                  user.lookingFor && user.lookingFor.map((item, index) => {
                    return (<p key={index}>{item}</p>);
                  })
                }
              </section>
            </div>
            <div className='card'>
              <header>
                <i className='material-icons highlight'>chat</i>
                {resource.user_profile_social}
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
              </header>
              <p>{user.bio}</p>
            </div>
            <div className='card border-bottom-highlight'>
              <header>
                <i className='material-icons highlight'>flash_on</i>
                {resource.interests}
              </header>
              <section className='row'>
                {
                  user.interests && user.interests.map((item, index) => {
                    return (<span key={index} className='col s4'>{item}</span>);
                  })
                }
              </section>
            </div>

            <div className='card border-bottom-highlight'>
              <header>
                <i className='material-icons highlight'>beenhere</i>
                {resource.achievements}
              </header>
              {
                user.achievements && user.achievements.map((achievement, index) => {
                  return <section key={index}>
                    <h3>{achievement.subject}
                      {achievement.highlight && <i className='star highlight float-right' />}
                    </h3>
                    <p className='description'>{achievement.description}</p>
                    <hr />
                  </section>;
                })
              }
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


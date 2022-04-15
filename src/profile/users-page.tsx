import { useRef } from "react";
import { DispatchWithCallback, enLocale, getCurrencyCode, getDecodeFromForm, getFields, getModel, getModelName, initFilter, InitSearchComponentParam, mergeParam, OnClick, PageSizeSelect, Searchable, SearchComponentParam, SearchComponentState, useSearch, value } from "../common";
import { useNavigate } from "react-router-dom";
import Pagination from "reactx-pagination";
import { handleError, inputSearch } from "uione";
import { getUserService, User, UserFilter } from "./user";
import { Skill } from "./user/user";

interface UserSearch extends SearchComponentState<User, UserFilter> {
  interest: string;
  skill: string;
  skillsList: string[];
  chipsSkill: string[];
  hireable: boolean;
}

const userFilter: UserFilter = {
  id: '',
  username: '',
  interests: [],
  skills: [],

  achievements: [],
  settings: {
  } as any,
  q: '',
}
const initialState: UserSearch = {
  list: [],
  filter: userFilter,
  interest: '',
  skill: '',
  skillsList: [],
  chipsSkill: [],
  hireable: false,
}

export function inArray<T>(arr: Array<T>, item: T): boolean {
  if (!arr || arr.length === 0) {
    return false;
  }
  const isExist = arr.filter(itemFilter => itemFilter === item).length > 0;
  return isExist;
}

const initialize = (load: (s: UserFilter, auto?: boolean | undefined) => void, set: DispatchWithCallback<Partial<UserSearch>>)=>{
  const userService = getUserService();
  userService.getUserBySearch(userFilter).then((users)=>{
    users?set({list:users}):set({list:[]});
  })
}

const param : InitSearchComponentParam<User,UserFilter,UserSearch> = {
  initialize,
  
}
export const UsersPage = () => {
  const navigate = useNavigate();
  const refForm = useRef();
  const userService = getUserService();
  const p1 = inputSearch();
  const getFilter = (se?:Searchable<User>): UserFilter => {
    if (!se) {
      se = component;
    }
    let keys = p && p.keys ? p.keys : undefined;
    if (!keys && typeof userService !== 'function' && userService.keys) {
      keys = userService.keys();
    }
    const n = getModelName();
    let fs = p && p.fields;
    if (!fs || fs.length <= 0) {
      fs = getFields();
    }
    const lc = (p1.getLocale ? p1.getLocale() : enLocale);
    const cc = getCurrencyCode();
    const obj3 = getModel<User, UserFilter>(state, n, se , fs, se.excluding, keys, se.list, refForm.current, getDecodeFromForm(p1), lc, cc);
    return obj3;
  };
  param.getFilter = getFilter;
  
  const p = mergeParam(param);
  const { state,search,setState, resource, component, updateState, sort, toggleFilter, changeView, pageChanged, pageSizeChanged } = useSearch<User, UserFilter, UserSearch>(refForm, initialState, userService, inputSearch(), param);
  
  component.viewable = true;
  component.editable = true;
  const filter = value(state.filter);

  const clearKeyworkOnClick = (e: OnClick) => {
    e.preventDefault();
    filter.q = "";
    updateState(e);
  }
  const viewDetail = (e: OnClick, id: string) => {
    e.preventDefault();

    navigate(`users/${id}`)
  }
  const changeInterest = (e: any) => {
    e.preventDefault();
    setState({ interest: e.target.value })
    // state.interest = e.target.value;
  }
  const addInterest = (e: OnClick) => {
    e.preventDefault();
    const { interest } = state;
    const interests = filter.interests ? filter.interests : [];
    if (interest && interest.trim() !== '') {
      if (!inArray<string>(interests, interest)) {
        interests.push(interest);
        filter.interests = interests;
        setState({ interest: '' })
      }
    }

  }
  const removeInterest = (e: OnClick, subject: string) => {
    e.preventDefault();

    if (filter.interests) {
      const interests = filter.interests.filter(item => item !== subject);
      filter.interests = interests;
      setState({ filter });
    }
  }

  const changeSkill = (e: any) => {
    setState({ skill: e.target.value })

  }

  // const search = (e:OnClick)=>{
  //   e.preventDefault();
  //   getUserService().getUserBySearch(filter).then((item)=>{
  //     setState({list:item as User[]});
  //     getFilter
  //   }).catch(error=>{
  //     handleError(error);
  //   })
  // }

  const addSkill = (e: OnClick) => {
    e.preventDefault();
    filter.skills = filter.skills ? filter.skills : [];
    const {skill,hireable} = state;
    const newSkill: Skill = { skill, hirable: state.hireable };
    if(skill && skill.trim()!==''){
      
      filter.skills.push(newSkill);
      setState({ filter })
      setState({ skill: '' })
    }
    

  }
  const removeSkill = (e: React.MouseEvent<HTMLElement, MouseEvent>, skillContent: string) => {
    e.preventDefault();
    filter.skills = filter.skills.filter(item => item['skill'] !== skillContent);
    setState({ filter });
  }
  const changeHireable = (e: any) => {
    setState({ hireable: !state.hireable });
  };
  return (
    <div className="view-container">
      <header>
        <div className="btn-group">
          {component.view !== 'table' && <button type='button' id='btnTable' name='btnTable' className='btn-table' data-view='table' onClick={changeView} />}
          {component.view === 'table' && <button type='button' id='btnListView' name='btnListView' className='btn-list-view' data-view='listview' onClick={changeView} />}
        </div>
      </header>
      <div>
        <form id="usersForm" name='usersForm' noValidate={true} ref={refForm as any}>
          <section className="row search-group">
            <label className="col s12 m6 search-input">
              <PageSizeSelect size={component.pageSize} sizes={component.pageSizes} onChange={pageSizeChanged} />
              <input type='text' id='q' name='q' value={filter.q} onChange={updateState} maxLength={255} placeholder={resource.keyword} />
              <button type='button' hidden={!filter.q} className='btn-remove-text' onClick={clearKeyworkOnClick} />
              <button type='button' className='btn-filter' onClick={toggleFilter} />
              <button type='submit' className='btn-search' onClick={search} />
            </label>
            <Pagination className='col s12 m6' total={component.total} size={component.pageSize} max={component.pageMaxSize} page={component.pageIndex} onChange={pageChanged} />

          </section>
          <section className='row search-group inline' hidden={component.hideFilter}>
            <label className='col s12 m12'>
              {resource.username}
              <input
                type='text'
                id='username'
                name='username'
                value={filter.username}
                onChange={updateState}
                maxLength={240}
                placeholder={resource.username} />
            </label>
            <section className="col s12 m12">
              {
                filter.interests && filter.interests.map((item, index) => {
                  return (<div key={index} className='chip' tabIndex={index}>
                    {item}
                    <button type='button' name='btnRemoveInterest' className='close' onClick={(e) => removeInterest(e, item)} />
                  </div>);
                })
              }
              <label className="row">
                {resource.interests}
                <input name='interest' className='col s12 inline-input' type="text"
                  value={state.interest}
                  onChange={changeInterest}
                  placeholder={resource.placeholder_user_profile_interest} maxLength={100} />
                <button type='button' id='btnAddInterest' name='btnAddInterest' className='btn-add' onClick={addInterest} />

              </label>
            </section>
            <section className="col s12 m12">
              {
                filter.skills && filter.skills.map((item, index) => {
                  return (<div key={index} className='chip' tabIndex={index}>
                    {item.skill} {item.hirable === true && <i className='star highlight' />}<button type='button' name='btnRemoveSkill' className='close' onClick={(e) => removeSkill(e, item.skill)} />
                  </div>);
                })
              }
              <label className="row">
              {resource.skills}
                <input name='skill' className='inline-input' type="text"
                  value={state.skill}
                  onChange={changeSkill}
                  placeholder={resource.placeholder_user_profile_skill} maxLength={100} />
                <label className='checkbox-container'>
                  <input type='checkbox' id='hireable' name='hireable' checked={state.hireable} onChange={changeHireable} />
                  {resource.user_profile_hireable_skill}
                </label>
                <button type='button' id='btnAddSkill' name='btnAddSkill' className='btn-add' onClick={addSkill} />
              </label>
            </section>
          </section>
        </form>
        <form className='list-result'>
          {component.view === 'table' &&
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>{resource.sequence}</th>
                    <th data-field='id'><button type='button' id='sortId' onClick={sort}>{resource.user_id}</button></th>
                    <th data-field='username'><button type='button' id='sortUsername' onClick={sort}>{resource.username}</button></th>
                  </tr>
                </thead>
                <tbody>{state.list && state.list.length > 0 && state.list.map((item, i) => {
                  return (
                    <tr key={i} onClick={e => viewDetail(e, item.id)}>
                      <td className='text-right'>{(item as any).sequenceNo}</td>
                      <td>{item.id}</td>
                      <td>{item.username}</td>
                    </tr>
                  );
                })}</tbody>
              </table></div>
          }
          {component.view !== 'table' && <ul className='row list-view'>
            {state.list && state.list.length > 0 && state.list.map((item, i) => {
              return (
                <li key={i} className='col s12 m6 l4 xl3' onClick={e => viewDetail(e, item.id)}>
                  <section>
                    <div>
                      <h3 >{item.username}</h3>
                    </div>
                    <button className='btn-detail' />
                  </section>
                </li>
              );
            })}
          </ul>}
        </form>
      </div>
    </div>
  )
}
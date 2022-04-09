import * as React from 'react';

export interface Props {
  key: string;
  id: string;
  name: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string | undefined>>;
}
export function TabCategory(props: Props) {
  const { id, name, setSelectedTab } = props;
  const handOnClick = () => {
    setSelectedTab(id);
  };
  return (
    <li className='tab'>
      <input
        type='radio'
        id={id}
        name='tab'
        onClick={handOnClick}
      />
      <label className='tab-label' htmlFor={id}>{name}</label>
    </li>
  );
}

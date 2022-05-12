import { useSearchParams } from 'react-router-dom';
import { Duration, ItemType, SortType } from 'video-service';
import { Filter } from '../../search';
import './Filter.css';

const types = [{ 'video': 'Video' }, { 'channel': 'Channel' }, { 'playlist': 'Play List' }];
const durations = [{ 'long': 'Over 20 Minutes' }, { 'medium': '4-20 Minutes' }, { 'short': 'Below 4 Minutes' }];
const orders = [{ 'relevance': 'Relevance' }, { 'date': 'Date' }, { 'rating': 'Rank' }];


interface Props {
  filter: Filter;
  handleFilterType: (value: ItemType) => Promise<void>;
  handleFilterDuration: (value: Duration) => Promise<void>;
  handleFilterOrder: (value: SortType) => Promise<void>;
}

const FilterBar = (props: Props) => {
  const [searchParams] = useSearchParams();

  return (
    <>
      <div className={`filter-container ${searchParams.get('filter')}`}>
        <div className='filter-type'>
          <div className='filter-group-name'>
            <h4>Search Type</h4>
          </div>
          {types.map((type: any) =>
            <div key={Object.keys(type)[0]} className={props.filter.type === Object.keys(type)[0] ? 'selected' : ''} onClick={() => props.handleFilterType(Object.keys(type)[0] === props.filter.type ? 'any' : Object.keys(type)[0] as ItemType)}>
              {type[Object.keys(type)[0]]} {props.filter.type === (Object.keys(type)[0]) && <>&#10006;</>}
            </div>
          )}
        </div>
        <div className='filter-type'>
          <div className='filter-group-name'>
            <h4>Duration</h4>
          </div>
          {durations.map((type: any) =>
            <div key={Object.keys(type)[0]} className={props.filter.duration === Object.keys(type)[0] ? 'selected' : ''} onClick={() => props.handleFilterDuration(Object.keys(type)[0] === props.filter.duration ? 'any' : Object.keys(type)[0] as Duration)}>
              {type[Object.keys(type)[0]]} {type[Object.keys(type)[0]]} {props.filter.duration === (Object.keys(type)[0]) && <>&#10006;</>}
            </div>
          )}
        </div>
        <div className='filter-type'>
          <div className='filter-group-name'>
            <h4>Order</h4>
          </div>
          {orders.map((type: any) =>
            <div key={Object.keys(type)[0]} className={props.filter.order === Object.keys(type)[0] ? 'selected' : ''} onClick={() => props.handleFilterOrder(Object.keys(type)[0] === props.filter.order ? 'relevance' : Object.keys(type)[0] as SortType)}>
              {type[Object.keys(type)[0]]} {type[Object.keys(type)[0]]} {props.filter.order === (Object.keys(type)[0]) && <>&#10006;</>}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default FilterBar;

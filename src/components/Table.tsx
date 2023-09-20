import React from "react"
import { Record } from '../types';

const Table = ({statistics}: {statistics: Record[]}) => {
  return (
    <div className='table'>
      <div className='table-row'>
        <div className='district-cell heading'>Districts</div>
        <div className='values-cell heading'>Values</div>
      </div>
      <div className='table-data'>
        {statistics.map((data) => (
          <div className='table-row'>
          <div className='district-cell'>{data.district}</div>
          <div className='values-cell'>{data.data}</div>
          </div>))}
      </div>
    </div>
  )
}

export default Table
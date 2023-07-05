import { AdjustmentsHorizontalIcon } from '@heroicons/react/20/solid'
import { Component } from 'react'

export default class FilterDropdown extends Component {

    render () {
        return (
            <div className="relative flex flex-col items-start w-32 h-28 rounded-lg">
                    <button 
                        onClick={this.props.onClick} 
                        className="p-5 mb-1 justify-between text-white px-3 w-32 h-10 bg-[#131A26] hover:opacity-80 rounded-lg text-base text-center inline-flex items-center">
                        Filter
                        <AdjustmentsHorizontalIcon className="w-5 h-5"/>
                    </button>
                
                {/* Collapse dropdown if toggle = true */}
                { this.props.toggle === false ? "" : 
                    <div className="bg-[#131A26] top-20 flex flex-col items-start rounded-lg p-2 w-32">
                        <this.DropdownItem text="  Completed" />
                        <this.DropdownItem text="  Uncompleted" />
                    </div>
                }     
            </div>
        )
    }

    DropdownItem(props) {
        return (
            <label className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                <input type="checkbox"/>
                {props.text}
            </label>
        )
    }
}

import * as React from 'react'
import cx from 'classnames'

export class ListItem extends React.Component {
	static defaultProps = {
		disabled: false,
		selected: false,
		focused: false,
		classes:"",
		selectedClassName:"is-selected",
		disabledClassName:"is-disabled",
		focusedClassName:"is-focused",

	}

	handleMouseOver = () => {
		this.props.onMouseOver(this.props.index)
	}

	handleChange = (ev) => {
		this.props.onChange({event: ev, index: this.props.index})
	}

	render() {
		let props = this.props
		let classes = cx('react-list-select--item', {
			[props.disabledClassname]: props.disabled,
			[props.focusedClassName]: props.focused,
			[props.selectedClassName]: props.selected,
		},props.className)


		return (
			<li
				className={classes}
				onMouseOver={this.handleMouseOver}
				onClick={this.handleChange}
			>
				{props.children}
			</li>
		)
	}
}
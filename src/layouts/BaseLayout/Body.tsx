import $$ from 'classnames'
import React, { FC } from 'react'
import Header, { HeaderProps } from './Header'
import $ from './style.module.scss'

export type BodyProps = HeaderProps & {
  bodyClassName?: string
  hasTopGap?: boolean
  centered?: boolean
  /**
   * First hide body, then
   * you should run `visualizeBody()`
   * to make body visible.
   */
  hideOnLoad?: boolean
  width?: 'xsmall' | 'small' | 'default' | 'large'
}

const Body: FC<BodyProps> = (props) => {
  const {
    children,
    bodyClassName,
    hasTopGap = true,
    centered = false,
    hideOnLoad = false,
    width = 'default',
  } = props

  return (
    <div
      className={$$(
        $['body-content'],
        bodyClassName,
        hasTopGap && $['top-gap'],
        centered && $['centered'],
        hideOnLoad && $['hidden'],
        [$[width]]
      )}
    >
      <Header {...props} />
      {children}
    </div>
  )
}

export default Body

export function visualizeBody(): void {
  document
    .getElementsByClassName($['body-content'])[0]
    .classList.remove($['hidden'])
}

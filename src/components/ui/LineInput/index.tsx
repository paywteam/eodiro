import { Magnifier } from '@/components/global/icons'
import EodiroColors from '@/modules/styles/EodiroColors'
import classNames from 'classnames'
import React, { useState } from 'react'
import $ from './style.module.scss'

export type LineInputOnChangeHook = (inputValue: string) => void

type LineInputProps = {
  value?: string
  setValue?: React.Dispatch<React.SetStateAction<string>>
  className?: string
  type?: 'text' | 'search' | 'email' | 'password'
  placeholder?: string
  onChangeHook?: LineInputOnChangeHook
  onChangeThrottle?: [LineInputOnChangeHook, number?]
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onEnter?: () => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  disabled?: boolean
  autoComplete?: string
  alignCenter?: boolean
  maxLength?: number
}

const IconField = React.memo(() => {
  return (
    <div className={$['magnifier-icon-wrapper']}>
      <Magnifier className={$['icon']} fill={EodiroColors.primary} />
    </div>
  )
})

export const LineInput = React.memo(
  React.forwardRef<HTMLInputElement, LineInputProps>(
    (
      {
        value,
        setValue = (): void => {},
        className,
        type = 'text',
        placeholder,
        onChangeHook = (): void => {},
        onChangeThrottle,
        onKeyDown,
        onKeyPress,
        onKeyUp,
        onEnter,
        onFocus,
        disabled = false,
        autoComplete,
        alignCenter,
        maxLength,
      },
      ref
    ) => {
      const [throttleTimeout, setThrottleTimeout] = useState<number | null>(
        null
      )

      return (
        <div className={classNames($['eodiro-line-input'], className)}>
          <input
            ref={ref}
            value={value}
            disabled={disabled}
            type={type === 'search' ? 'text' : type}
            spellCheck="false"
            maxLength={maxLength}
            placeholder={placeholder}
            className={classNames(
              $['li-field'],
              type === 'search' && $['search'],
              alignCenter && $['center']
            )}
            onChange={(e): void => {
              e.persist()
              const { value: targetValue } = e.target
              setValue(targetValue)
              onChangeHook(targetValue)

              // No Hangul in password field
              if (type === 'password') {
                if (targetValue.match(/[ㄱ-힣]/)) {
                  alert('암호에 한글을 사용할 수 없습니다.')
                  setValue('')
                }
              }

              if (!onChangeThrottle) return
              const [
                throttleHook = (): void => {},
                throttle = 300,
              ] = onChangeThrottle
              if (throttleTimeout) {
                window.clearTimeout(throttleTimeout)
              }
              setThrottleTimeout(
                window.setTimeout(() => {
                  throttleHook(targetValue)
                }, throttle)
              )
            }}
            onKeyDown={(e): void => {
              if (onKeyDown) {
                onKeyDown(e)
              }

              if (onEnter && e.key === 'Enter') {
                onEnter()
              }
            }}
            onKeyPress={onKeyPress}
            onKeyUp={onKeyUp}
            onFocus={onFocus}
            autoComplete={autoComplete}
          />
          {type === 'search' && <IconField />}
        </div>
      )
    }
  )
)

import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContentDiffPanel } from './ContentDiffPanel'

describe('ContentDiffPanel', () => {
  it('renders draft and published sections with highlighted changes', () => {
    const { container } = render(
      <ContentDiffPanel
        draftZh="Hello Draft World"
        draftEn="Draft English"
        publishedZh="Hello Published World"
        publishedEn="Published English"
      />
    )

    expect(screen.getByText('Current Draft')).toBeInTheDocument()
    expect(screen.getByText('Published Version')).toBeInTheDocument()
    expect(container.querySelectorAll('mark').length).toBeGreaterThan(0)
  })

  it('renders empty fallbacks when published content is missing', () => {
    render(
      <ContentDiffPanel
        draftZh="Only draft content"
        draftEn="Only draft english"
        publishedZh=""
        publishedEn=""
      />
    )

    expect(screen.getByText('未发布')).toBeInTheDocument()
    expect(screen.getByText('Not published')).toBeInTheDocument()
  })
})

import { h } from 'hyperapp'
import { Compose } from '../'
import './sidebar.styl'

export const SideBar = () => ({ tab }, { setTab }) => (
  <div key="sidebar" class="sidebar" container="column #top @stretch">
    {/* Bar Title */}
    <div class="sidebar-title">Cardinal</div>

    {/* Tabs */}
    <div class="sidebar-tabs" container="row #spaced @middle">
      <button
        class={tab === 'compose' && 'active'}
        onclick={() => setTab('compose')}
      >
        Compose
      </button>

      <button
        class={tab === 'preview' && 'active'}
        onclick={() => setTab('preview')}
      >
        Preview
      </button>
    </div>

    {tab === 'compose' ? <Compose /> : <h2>Preview</h2>}
  </div>
)

SideBar.state = {
  tab: 'compose',
}

SideBar.actions = {
  setTab: tab => state => ({ ...state, tab }),
}
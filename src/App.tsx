import * as csv from "csvtojson"
import { currency, locale } from "locale-service"
import { phonecodes } from "phonecodes"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { alertError, confirm, resources as uiplusResources } from "ui-alert"
import { loading } from "ui-loading"
import { resources as uiresources, UIService } from "ui-plus"
import { toast } from "ui-toast"
import { storage, StringMap } from "uione"
import { resources as vresources } from "validation-core"
import { DefaultCsvService, resources } from "web-clients"
import { AuditLogsForm } from "./audit-logs"
import { ChangePasswordForm } from "./authentication/change-password-form"
import { ForgotPasswordForm } from "./authentication/forgot-password-form"
import { ResetPasswordForm } from "./authentication/reset-password-form"
import { SigninForm } from "./authentication/signin-form"
import { SignupForm } from "./authentication/signup-form"
import { resources as videoResources } from "./clients"
import { config } from "./config"
import LayoutComponent from "./core/layout"
import { resources as locales } from "./core/resources"
import { MyProfileForm } from "./my-profile/my-profile-form"
import { MySettingsForm } from "./my-profile/my-settings-form"
import RolesRoute from "./roles"
import UsersRoute from "./users"
import ChannelPage from "./video/channel"
import ChannelsPage from "./video/channels"
import HomePage from "./video/home"
import PlaylistPage from "./video/playlist"
import SearchPage from "./video/search"
import VideoPage from "./video/video"

// tslint:disable:ordered-imports
import "./App.css"
import "./assets/css/alert.css"
import "./assets/css/article.css"
import "./assets/css/badge.css"
import "./assets/css/button.css"
import "./assets/css/checkbox.css"
import "./assets/css/dark.css"
import "./assets/css/date-picker.css"
import "./assets/css/diff.css"
import "./assets/css/form.css"
import "./assets/css/grid.css"
import "./assets/css/layout.css"
import "./assets/css/list-detail.css"
import "./assets/css/list-view.css"
import "./assets/css/loader.css"
import "./assets/css/main.css"
import "./assets/css/modal.css"
import "./assets/css/multi-select.css"
import "./assets/css/profile.css"
import "./assets/css/radio.css"
import "./assets/css/reset.css"
import "./assets/css/search.css"
import "./assets/css/solid-container.css"
import "./assets/css/table.css"
import "./assets/css/theme.css"
import "./assets/fonts/material-icon/css/material-icons.css"
import "./assets/fonts/Roboto/font.css"

// axios.defaults.withCredentials = true

export const statusNames: Map<string, string> = new Map([
  ["A", "Active"],
  ["I", "Inactive"],
])
function getStatusName(status?: string, map?: StringMap): string | undefined {
  if (!status) {
    return ""
  }
  return statusNames.get(status)
}

let isInit = false
export function init() {
  if (isInit) {
    return
  }
  isInit = true
  storage.setConfig(config)
  resources.csv = new DefaultCsvService(csv)
  videoResources.csv = new DefaultCsvService(csv)
  if (storage.home == null || storage.home === undefined) {
    storage.home = "/users"
  }
  storage.home = "/users"
  // storage.token = getToken;
  storage.moment = true
  storage.setResources(locales)
  storage.setLoadingService(loading)
  storage.setUIService(new UIService())
  storage.currency = currency
  storage.locale = locale
  storage.alert = alertError
  storage.confirm = confirm
  storage.message = toast
  storage.getStatusName = getStatusName

  const resource = storage.resource()
  vresources.phonecodes = phonecodes
  // uiresources.date = parseDate;
  uiresources.currency = currency
  uiresources.resource = resource

  const res = storage.getResource()

  uiplusResources.confirmHeader = res.confirm
  uiplusResources.leftText = res.no
  uiplusResources.rightText = res.yes
  uiplusResources.errorHeader = res.error
  uiplusResources.warningHeader = res.warning
  uiplusResources.infoHeader = res.info
  uiplusResources.successHeader = res.success
}
function App() {
  init()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="signin" element={<SigninForm />} />
        <Route path="signup" element={<SignupForm />} />
        <Route path="change-password" element={<ChangePasswordForm />} />
        <Route path="reset-password" element={<ResetPasswordForm />} />
        <Route path="forgot-password" element={<ForgotPasswordForm />} />
        <Route path="" element={<LayoutComponent />}>
          <Route index={true} element={<HomePage />} />
          <Route path="users/*" element={<UsersRoute />} />
          <Route path="roles/*" element={<RolesRoute />} />
          <Route path="audit-logs" element={<AuditLogsForm />} />
          <Route path="my-profile" element={<MyProfileForm />} />
          <Route path="my-profile/settings" element={<MySettingsForm />} />
          {/*} <Route path='users' element={<UsersPage />} />
          <Route path='users/:id' element={< UserPage/>} />
          */}
          <Route path="home" element={<HomePage />} />
          <Route path="search/*" element={<SearchPage />} />
          <Route path="channels" element={<ChannelsPage />} />
          <Route path="channels/:id" element={<ChannelPage />} />
          <Route path="playlists/:id" element={<PlaylistPage />} />
          <Route path=":id" element={<VideoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App

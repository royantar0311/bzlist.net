import {Storage, storage, authHeaders} from ".";
import {api} from "./utils";

export interface IBoolSetting{
  key: string;
  defaultValue?: boolean;
}

class Settings extends Storage{
  COMPACT_TABLES: IBoolSetting = {
    key: "compactTables"
  };
  ONLY_SERVERS_WITH_PLAYERS: IBoolSetting = {
    key: "onlyServersWithPlayers"
  };
  EXCLUDE_OBSERVERS: IBoolSetting = {
    key: "excludeObservers"
  };
  CUSTOM_SCROLLBARS: IBoolSetting = {
    key: "customScrollbars",
    defaultValue: true
  };
  NOTIFICATIONS: IBoolSetting = {
    key: "notifications",
    defaultValue: true
  };
  SERVER_NOTIFICATIONS: IBoolSetting = {
    key: "serverNotifications",
    defaultValue: true
  };
  PLAYER_NOTIFICATIONS: IBoolSetting = {
    key: "playerNotifications",
    defaultValue: true
  };
  DISABLE_ANIMATIONS: IBoolSetting = {
    key: "disableAnimations",
    defaultValue: false
  };
  INFO_CARDS: IBoolSetting = {
    key: "infoCards",
    defaultValue: false
  };
  DISABLE_REALTIME_DATA: IBoolSetting = {
    key: "disableRealtimeData",
    defaultValue: false
  };
  DATA_SAVER: IBoolSetting = {
    key: "dataSaver",
    defaultValue: false
  };
  DISABLE_ANALYTICS: IBoolSetting = {
    key: "disableAnalytics",
    defaultValue: false
  };
  IGNORE_OBSERVER_BOTS: IBoolSetting = {
    key: "ignoreObserverBots",
    defaultValue: true
  };

  constructor(){
    super("setting_");
    this.onChange = async (key: string, value: string, sync: boolean = true): Promise<void> => {
      if(key === this.DISABLE_ANIMATIONS.key){
        document.documentElement.style.setProperty("--animations", value !== "true" ? "1" : "0");
      }else if(key === this.CUSTOM_SCROLLBARS.key){
        if(this.getBool(this.CUSTOM_SCROLLBARS)){
          document.documentElement.classList.add("custom-scrollbars");
        }else{
          document.documentElement.classList.remove("custom-scrollbars");
        }
      }

      if(storage.get("syncSettings") === "false" || !sync){
        return;
      }

      const token = storage.get("token");
      if(token !== ""){
        api("users/settings", {settings: this.json()}, "PATCH", {
          ...(await authHeaders())
        });
      }
    };
  }

  getBool(setting: IBoolSetting): boolean{
    if(navigator.userAgent.indexOf("Edge/") > -1 && setting.key === this.DISABLE_ANIMATIONS.key){
      return false;
    }

    const value = localStorage.getItem(this.prefix+setting.key);
    return value ? value === "true" : setting.defaultValue || false;
  }

  setBool(setting: IBoolSetting, value: boolean, sync = true): void{
    if(value === (setting.defaultValue || false)){
      this.remove(setting.key);
      this.onChange(setting.key, value.toString(), sync);
      return;
    }

    this.set(setting.key, value.toString(), sync);
  }
}

export const settings = new Settings();

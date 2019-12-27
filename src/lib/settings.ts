import {Storage, storage} from ".";
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

  constructor(){
    super("setting_");
    this.onChange = (key: string, value: string, sync: boolean = true): void => {
      if(storage.get("syncSettings") !== "true" || !sync){
        return;
      }

      const token = storage.get("token");
      if(token !== ""){
        api("users/settings", {settings: this.json()}, "PATCH", {
          "Authorization": `Bearer ${token}`
        });
      }
    };
  }

  getBool(setting: IBoolSetting): boolean{
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

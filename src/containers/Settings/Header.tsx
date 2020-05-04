import React from 'react'

interface IHeader {
  username: string,
  lastActive: Date,
  lang: string,
  dayjs: any,
  t: any
}

const Header: React.FC<IHeader> = ({ username, lastActive, lang, t, dayjs }) => (
  <div className="col-md-12">
    <span className="head">
      <span>
        {t("Hello")}, {username} 👋
      </span>
    </span>
    <span className="title">
      {t("loggedin")}:{" "}
      {dayjs(lastActive)
        .locale(lang)
        .format("MMMM DD, YYYY @ HH:mm")}
    </span>
  </div >
);

export default Header;

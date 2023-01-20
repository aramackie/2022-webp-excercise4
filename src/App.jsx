import { useEffect, useState } from "react";
import { fetchAvailabilities } from "./api";

function Header() {
  return (
    <header className="hero is-dark is-bold">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">日大文理空き教室サーチャー</h1>
          <h2 className="subtitle">NUCHS Empty Classroom Searcher</h2>

        </div>
      </div>
    </header>
  );
}

const getCurrentPeriod = () => {
  const timetable = [
    { "period": "授業時間外", "endTime": "1970-01-01T09:00:00" },
    { "period": "1限授業中", "endTime": "1970-01-01T10:30:00" },
    { "period": "休み時間（次は2限）", "endTime": "1970-01-01T10:40:00" },
    { "period": "2限授業中", "endTime": "1970-01-01T12:10:00" },
    { "period": "休み時間（次は3限）", "endTime": "1970-01-01T13:00:00" },
    { "period": "3限授業中", "endTime": "1970-01-01T14:30:00" },
    { "period": "休み時間（次は4限）", "endTime": "1970-01-01T14:40:00" },
    { "period": "4限授業中", "endTime": "1970-01-01T16:10:00" },
    { "period": "休み時間（次は5限）", "endTime": "1970-01-01T16:20:00" },
    { "period": "5限授業中", "endTime": "1970-01-01T17:50:00" },
    { "period": "授業時間外", "endTime": "1970-01-02T00:00:00" }
  ];

  const currentTime = new Date();
  currentTime.setDate(1);
  currentTime.setMonth(0);
  currentTime.setFullYear(1970);

  for (const item of timetable) {
    console.log();
    if (currentTime < new Date(item.endTime)) {
      return item.period;
    }
  }
};

function Status() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, [date]);

  const yyyy = date.getFullYear();
  const M = date.getMonth() + 1;
  const d = date.getDate();
  const hh = ('0' + date.getHours()).slice(-2);
  const mm = ('0' + date.getMinutes()).slice(-2);
  const ss = ('0' + date.getSeconds()).slice(-2);

  return (
    <div className="box">
      <div className="has-text-centered">
        {yyyy}年{M}月{d}日
      </div>
      <div className="has-text-centered title is-3">
        {hh}:{mm}:{ss}
      </div>
      <div className="has-text-centered title is-6">
        現在：<span className="tag is-warning is-large">{getCurrentPeriod()}</span>
      </div>
    </div>
  );
}

function RadioButtons(props) {
  return (

    <div className="tabs is-toggle is-fullwidth">
      <ul>
        {
          props.data.map((elem) => {
            return (
              <li key={elem.value} className={(elem.value === props.selectedValue) ? 'is-active' : ''}>
                <label>
                  <a>
                    <input type="radio" name={props.name} value={elem.value} checked={elem.value === props.selectedValue} onChange={props.handleChange} />
                    {elem.label}
                  </a>
                </label>
              </li>
            );
          })
        }
      </ul>
    </div >
  );
}

function Form(props) {
  const handleChange = (event) => {
    return (e) => {
      if (e.target.checkValidity()) {
        props.setParams({ ...props.params, [event]: Number(e.target.value) });
      } else {
        e.target.reportValidity();
      }
    };
  }

  const semesters = [{ "value": 1, "label": "前期" }, { "value": 2, "label": "後期" }];

  const days = [{ "value": 1, "label": "月" }, { "value": 2, "label": "火" }, { "value": 3, "label": "水" }, { "value": 4, "label": "木" }, { "value": 5, "label": "金" }, { "value": 6, "label": "土" }];

  const periods = [{ "value": 1, "label": "1限" }, { "value": 2, "label": "2限" }, { "value": 3, "label": "3限" }, { "value": 4, "label": "4限" }, { "value": 5, "label": "5限" }];

  return (
    <div className="box">
      <h3 className="title is-4 formHeader">表示内容選択欄</h3>
      <label className="label">年度</label>
      <div className="field has-addons ">
        <div className="control">
          <input className="input" type="number" defaultValue={props.params.year} onChange={handleChange('year')} step="1" min="2022" />
        </div>
        <div className="control">
          <a className="button is-static">年度</a>
        </div>
      </div>
      <label className="label">学期</label>
      <RadioButtons data={semesters} selectedValue={props.params.semester} handleChange={handleChange('semester')} />
      <label className="label">曜日</label>
      <RadioButtons data={days} selectedValue={props.params.day} handleChange={handleChange('day')} />
      <label className="label">時限</label>
      <RadioButtons data={periods} selectedValue={props.params.period} handleChange={handleChange('period')} />
    </div>
  );
}

function Loading() {
  return (
    <p><span className="loader"></span> データ取得中です･･･</p>
  );
}

function Classroom(props) {
  const { classroom } = props;
  const availability = (classroom.availability === 1) ? '⭕' : '-';
  return (
    <>
      <td className="has-text-centered name">{classroom.name}</td>
      <td className="has-text-centered availability">{availability}</td>
      <td className="has-text-centered grade">{classroom.grade}</td>
      <td className="className">{classroom.className}</td>
      <td className="teacher">{classroom.teacher}</td>
    </>
  );
}

function Building(props) {
  const { building } = props;
  return (
    <div className="panel">
      <div className="panel-heading">{building.name}</div>
      <div className="table-container">
        <table className="table is-bordered is-striped is-narrow is-fullwidth">
          <thead>
            <tr>
              <th className="has-text-centered">教室名</th>
              <th className="has-text-centered">空き状況</th>
              <th className="has-text-centered">学年</th>
              <th>授業名</th>
              <th>担当教員</th>
            </tr>
          </thead>
          <tbody>
            {
              building.classrooms.map((classroom) => {
                return (
                  <tr key={classroom.name}>
                    <Classroom classroom={classroom} />
                  </tr>
                );
              })
            }
          </tbody>
        </table></div>
    </div>
  );
}

function Viewer(props) {
  const { availabilities } = props;
  const days = ["日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜"];
  return (
    <div className="box">
      <h3 className="title is-3">
        {days[props.params.day]}{props.params.period}{props.params.period !== '' ? '限の' : ''}空き教室状況
      </h3>
      <div>
        {
          (availabilities == null) ? <Loading /> : (
            availabilities.map((building) => {
              return (
                <div key={building.name}>
                  <Building building={building} />
                </div>
              );
            })
          )
        }
      </div>
    </div>
  );
}

function Main() {
  const [params, setParams] = useState({ "year": "", "semester": "", "day": "", "period": "" });
  const [availabilities, setAvailabilities] = useState(null);
  
  useEffect(() => {
    setAvailabilities(null);
    fetchAvailabilities(params).then((data) => {
      const { availabilities: availabilitiesData, ...paramsData } = data;
      setAvailabilities(availabilitiesData);
      if (params.semester === "") {
        setParams(paramsData);
      }
    });
  }, [params]);

  return (
    <main className="container is-max-desktop">
      <section className="section">
        <div className="container">
          <Status />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Form params={params} setParams={setParams} availabilities={availabilities} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Viewer params={params} availabilities={availabilities} />
        </div>
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>空き教室データ：NUCHS Empty Classroom API</p>
        <p>作成者：情報科学科2年 荒牧諒亮</p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
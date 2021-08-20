import React, {useState} from 'react';
import axios from 'axios';

import Input from './Input';
import Info from './Info';

export default () => {
    const [domains, setDomains] = useState({});
    const [info, setInfo] = useState(undefined);

    const search = async () => {
        const list = Object.values(domains).map(d => {
           return d.value;
        });

        setInfo(null);
        const { data } = await axios.post("/api/check_multi", {
            list,
        }, {});
        setInfo(undefinoed);

        setDomains(domains => {
            let newDomains = {};
            for (const domain in domains) {
                newDomains[domain] = {...domains[domain], res: data[domains[domain].value]};

                if (newDomains[domain]?.res?.available) {
                    newDomains[domain].ref.style.backgroundColor = 'green';
                }
            }
           return {...newDomains};
        });
    };

    return (
      <div>
          <h2>GE Whois Multi Domain Checker</h2>
          <div>
              <Input domains={domains} setDomains={setDomains} setInfo={setInfo} />
              <button onClick={search}>Search</button>
          </div>
          <div>
              <Info info={info} />
          </div>
      </div>
    );
};


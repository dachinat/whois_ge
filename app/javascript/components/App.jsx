import React, {useState} from 'react';
import axios from 'axios';
import {BaseStyles, Box, Heading, ButtonOutline} from '@primer/components';

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
        setInfo(undefined);

        setDomains(domains => {
            let newDomains = {};
            for (const domain in domains) {
                newDomains[domain] = {...domains[domain], res: data[domains[domain].value]};

                if (newDomains[domain]?.res?.available) {
                    newDomains[domain].ref.parentElement.style.backgroundColor = '#7ad687';
                    newDomains[domain].ref.style.backgroundColor = '#7ad687';
                }
            }
           return {...newDomains};
        });
    };

    return (
      <BaseStyles>
          <Box color="text.secondary" bg="bg.tertiary" p={3} m={4}>
              <Heading mb={2}>GE Whois Multi Domain Checker</Heading>
          </Box>
          <Box display="flex">
              <Box flex={1} borderColor="border.primary" borderWidth={1} borderStyle="solid" p={5} m={3}>
                  <Input domains={domains} setDomains={setDomains} setInfo={setInfo} />
                  <ButtonOutline onClick={search} m={2}>Search</ButtonOutline>
              </Box>
              <Box flex={1} borderColor="border.primary" borderWidth={1} borderStyle="solid" p={5} m={3}>
                  <Info info={info} />
              </Box>
          </Box>
      </BaseStyles>
    );
};


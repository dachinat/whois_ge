import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from "react-dom";
import {Box, TextInput, Button} from '@primer/react';
import {PlusIcon, DashIcon, InfoIcon, StarIcon, StarFillIcon } from '@primer/octicons-react'

export default ({domains, setDomains, setInfo}) => {
    const [inputs, setInputs] = useState([]);
    const [selectedInput, setSelectedInput] = useState(null);

    let refs = useRef([]);
    let favRefs = useRef([]);
    let count = 0;

    useEffect(() => {

        let starred = [];
        const localStorageStarred = localStorage.getItem('starred');
        starred = JSON.parse(localStorageStarred);
        if (starred.length > 0) {

          starred.forEach((domain, i) => {
            setTimeout(() => addInput(count, domain), 0);
          });

          setTimeout(() => {
            refs.current.forEach((ref, i) => {
              if (ref) {
                ReactDOM.render(star(ref.value), favRefs.current[i]);
                setDomains(domains => ({...domains, [i]: {value: ref.value, ref: refs.current[i]}}));
              }
            });
          },0)

        } else {
          addInput();
        }
    }, []);

    useEffect(() => {
        setInfo(domains[selectedInput]?.res);
    }, [selectedInput, domains]);

    const refPos = {};

    const addInput = (currentKey = 0, domain = '') => {
        count++;
        setInputs(inputs => {
            const input = refs.current[currentKey];
            if (input) {
                applyRegex(input);
            }

            let newInputs = [];
            inputs.forEach((input) => {

                newInputs.push(input);
                if (currentKey.toString() === input.key) {
                    newInputs.push(renderInput(count, domain));
                }
            });

            if (inputs.length === 0) {
                newInputs.push(renderInput(count, domain));
            }

            return [...newInputs];
        });
    };

    const removeInput = (key) => {
        if (key === 1) {
          return;
        }

        goUp(key);

        setInputs(inputs => {
            if (inputs.length === 1) {
                return inputs;
            }
            let newInputs = [...inputs];
            newInputs = newInputs.filter(input => {
                return input.key !== key.toString()
            });

            return newInputs;
        });
    };

    const goUp = key => {
        setInputs(inputs =>{
            let tmp;
            inputs.every((item, index) => {
              if (parseInt(item.key) === key) {
                  return false;
              }
              tmp = parseInt(item.key);
              return true;
            });
            try {
                const input = refs.current[refPos[tmp] || 1];

                input.focus();
                setTimeout(() => {
                    const end = input.value.length;
                    input.setSelectionRange(end, end);
                }, 0);
            } catch (e) {}
            return [...inputs];
        });
    }

    const goDown = key => {
        setInputs(inputs => {

            let tmp;
            inputs.every((item, index) => {

               tmp = index;
               if (parseInt(item.key) === key) {
                   return false;
               }
               return true;
            });

            try {
                tmp = parseInt(inputs[tmp + 1].key) || undefined;

                const input = refs.current[refPos[tmp]];
                const end = input.value.length;

                input.focus();
                input.setSelectionRange(2,2);
            } catch(e) {
            }

            return [...inputs];
        });


        // let tmp;
        // refs.current.every((item, index) => {
        //     if (index > key && item !== null) {
        //         tmp = index;
        //         return false;
        //     }
        //     return true;
        // });
        // refs.current[tmp].focus();
    }

    const applyRegex = el => {
        let lastValue = el.value;

        let regex, match;

        // filter input
        regex = /[^A-Z|a-z|0-9|-|.|\r|\n]+/gm;
        if (el.value.match(regex)) {
            let result = el.value.replace(regex, '');
            el.value = result;
        }

        // replace double dots
        regex = /\.+/;
        if (el.value.match(regex)) {
            let result = el.value.replace(regex, '.');
            el.value = result;
        }

        // replace leading - and .
        regex = /^[-|.]+(.*)/m;
        if (el.value.match(regex)) {
            let result = el.value.replace(regex, '$1');
            el.value = result;
        }

        // add .ge
        if (el.value && el.value.match(/.+\.ge$/) === null) {
            let result = el.value.replace(/(.+)(?!\.ge(\n))/, '$1.ge$2');
            el.value = result;
        }

        //replace non .com.ge .edu.ge .net.ge .org.ge pvt.ge
        regex = /(.+)\.(?!com)(?!net)(?!edu)(?!org)(?!pvt)(.*)\.(.*)/;
        match = el.value.match(regex);
        if (match !== null) {
            let result = el.value.replace(regex, '$1.ge');
            el.value = result;
        }

        // make letters lowercase
        el.value = el.value.toLowerCase();

        // Dipatch change event
        let event = new Event('change', { bubbles: true });
        event.simulated = true;
        let tracker = el._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        el.dispatchEvent(event);
    };

    const addRemoveStar = key => {

      const domain = refs.current[key].value;

      if (domain.length < 1) {
        return;
      }

      let starred = [];

      const localStorageStarred = localStorage.getItem('starred');

      if (localStorageStarred) {
        starred = JSON.parse(localStorageStarred);
      }

      if (starred.includes(domain)) {
        starred = starred.filter(k => k !== domain);
      } else {
        starred.push(domain);
      }

      localStorage.setItem('starred', JSON.stringify(starred));

      refs.current.forEach((ref, i) => {
        if (ref) {
          ReactDOM.render(star(ref.value), favRefs.current[i]);
        }
      });
    };

    const star = domain => {
      let starred = [];

      const localStorageStarred = localStorage.getItem('starred');

      if (localStorageStarred) {
        starred = JSON.parse(localStorageStarred);
      }

      if (starred.includes(domain)) {
        return <StarFillIcon />;
      }
      return <StarIcon />;
    };

    const renderInput = (key, domain = '') => {
        return (
          <div key={key}>
              <Box display="flex">
                  <span><Button variant="invisible" onClick={e => {
                    addRemoveStar(key);
                  }}>
                    <div ref={el => {
                      return favRefs.current[key] = el;
                    }}>
                      <StarIcon />
                    </div>
                  </Button></span>
                  <TextInput defaultValue={domain} ref={el => {
                      refPos[key] = refs.current.length;
                      return refs.current[key] = el;
                  }} type="text"
                     onChange={e => {
                         e.target.style.backgroundColor = 'white';
                         e.target.parentElement.style.backgroundColor = 'white';
                         setDomains(domains => ({...domains, [key]: {value: e.target.value, ref: refs.current[key]}}));

                         ReactDOM.render(star(refs.current[key].value), favRefs.current[key]);
                     }}
                     onKeyDown={e => {
                      if (e.key === 'Enter') {
                          addInput(key);
                      } else if (e.key === 'Backspace') {
                          if (e.target.value === '') {
                              removeInput(key);
                              e.preventDefault();
                          }
                      } else if (e.key === 'ArrowUp') {
                          goUp(key);
                      } else if (e.key === 'ArrowDown') {
                          goDown(key);
                      } else if (e.ctrlKey && e.keyCode === 88) {
                          removeInput(key);
                      }
                  }} onFocus={() => setSelectedInput(key)} autoFocus />
                  <span><Button variant="invisible" onClick={e => removeInput(key)}><DashIcon /></Button></span>
                  <span><Button variant="invisible" onClick={e => addInput(key)}><PlusIcon /></Button></span>
                  <span>

                      <Button variant="invisible" onClick={e => refs.current[key].focus()}><InfoIcon/></Button>
                  </span>
              </Box>
          </div>
        );
    }

    return (
        <div>
            <Box m={2}>
              Use arrow and enter keys for navigation
            </Box>
            <div>
                {inputs}
            </div>
        </div>
    );
};
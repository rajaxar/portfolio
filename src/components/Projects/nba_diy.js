import { useEffect, useState } from 'react';
import NBASalaryScatterplot from "./nba_scatterplot";
import NBAKDEPlot from './nba_kde_standalone';
import * as d3 from 'd3';
import { MultiSelect, NumberInput, Checkbox, Group } from '@mantine/core';

function NBADIY() {
    const [total_data, setTotalData] = useState([]);
    const [filtered_data, setFilteredData] = useState([]);

    const [filters, setFilters] = useState({
        position: [],
        age: [],
        salary: []
    });

    const positionOptions = total_data.map(d => d.position).filter((value, index, self) => self.indexOf(value) === index).map(position => ({ value: position, label: position }));
    const ageOptions = [
        { value: '20-25', label: '20-25' },
        { value: '26-30', label: '26-30' },
        { value: '31-35', label: '31-35' },
        { value: '36-40', label: '36-40' }
    ];
    const salaryOptions = [
        { value: '0-2500000', label: '0-2.5M' },
        { value: '2500000-5000000', label: '2.5M-5M' },
        { value: '5000000-10000000', label: '5M-10M' },
        { value: '10000000+', label: '10M+' }
    ];

    useEffect(() => {
        d3.csv(process.env.PUBLIC_URL + "/final_KDE.csv").then(data => {
            data.filter(d => d.position === " PG" || d.position === " SG" || d.position === " SF" || d.position === " PF" || d.position === " C");

            setTotalData(data);
            setFilteredData(data);
        });
    }, []);

    useEffect(() => {
        const filtered = total_data.filter(d => {
            const ageMatch = filters.age.length === 0 || filters.age.some(ageRange => {
                const [min, max] = ageRange.split('-').map(Number);
                return d.ageDuringContractYear >= min && d.ageDuringContractYear <= max;
            });
            const positionMatch = filters.position.length === 0 || filters.position.includes(d.position);
            const salaryMatch = filters.salary.length === 0 || filters.salary.some(salaryRange => {
                // Check if the salary range ends with '+' for ranges without an upper limit
                if (salaryRange.endsWith('+')) {
                    const min = Number(salaryRange.slice(0, -1));
                    return d.contract_salary >= min;
                } else {
                    // Split the range into min and max values and adjust for unit differences
                    const [min, max] = salaryRange.split('-').map(Number);
                    // No need to multiply by 1e6 as we're directly using the values provided
                    return d.contract_salary >= min && d.contract_salary <= max;
                }
            });
                        return ageMatch && positionMatch && salaryMatch;
        });
        setFilteredData(filtered);
    }, [filters, total_data]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: '3rem', fontFamily: "Graphik"}}>
                <MultiSelect
                    data={positionOptions}
                    value={filters.position}
                    onChange={(value) => setFilters(prev => ({ ...prev, position: value }))}
                    placeholder="Filter by position"
                    label="Position"
                    size='lg'
                    w={350}
                    h={100}
                />
                <MultiSelect
                    data={ageOptions}
                    value={filters.age}
                    onChange={(value) => setFilters(prev => ({ ...prev, age: value }))}
                    placeholder="Filter by age"
                    label="Age"
                    size='lg'
                    w={350}
                    h={100}
                />
                <MultiSelect
                    data={salaryOptions}
                    value={filters.salary}
                    onChange={(value) => setFilters(prev => ({ ...prev, salary: value }))}
                    placeholder="Filter by salary"
                    label="Salary"
                    size='lg'
                    w={350}
                    h={100}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <NBAKDEPlot data={filtered_data} />
                <NBASalaryScatterplot data={filtered_data} />
            </div>
        </div>
    );
}

export default NBADIY;

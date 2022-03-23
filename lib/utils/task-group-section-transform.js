import { map, uniq, compact, flatten } from 'lodash';

export default transformIntoGroupSections = (tasks, userId = null) => {
    let sections = [];

    const mapHousekeepingTasks = map(tasks, 'room.housekeepingTasks', []);
    const mapResponsible = map(mapHousekeepingTasks, function (HSKArray) {
        const responsible = map(HSKArray, 'responsible');
        const responsibleUserId = compact(uniq(map(responsible, 'id')));
        const responsibleSubGroupId = compact(uniq(map(responsible, 'userSubGroupId')));
        const responsibleGroupId = compact(uniq(map(responsible, 'userGroupId')));

        return {
            responsibleUserId,
            responsibleSubGroupId,
            responsibleGroupId
        }

    })

    const mapResponsibleUserId = uniq(flatten(map(mapResponsible, 'responsibleUserId')))
    const mapResponsibleSubGroupId = uniq(flatten(map(mapResponsible, 'responsibleSubGroupId')))
    const mapResponsibleGroupId = uniq(flatten(map(mapResponsible, 'responsibleGroupId')))

    sections = {
        responsibleUserId: mapResponsibleUserId,
        responsibleSubGroupId: mapResponsibleSubGroupId,
        responsibleGroupId: mapResponsibleGroupId
    }

    return sections;
}
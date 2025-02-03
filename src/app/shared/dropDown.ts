export let MENU_ITEMS: any[] = [];
export let DROPDOWN_OPTION_LIST: any[] = [];
DROPDOWN_OPTION_LIST =[
{
    "meetingPlatform": [
        {
            "name": "Zoom",
            "code": "zoom"
        },
        {
            "name": "Google Meet",
            "code": "googlemeet"
        },
        {
            "name": "Microsoft Teams",
            "code": "teams"
        },
    ]
}]
MENU_ITEMS = [...DROPDOWN_OPTION_LIST];
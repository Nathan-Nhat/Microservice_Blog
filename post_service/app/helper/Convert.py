from datetime import datetime, timedelta


def DateTimeCnv(date):
    return datetime.strptime(date, '%Y-%m-%d %H:%M:%S')

def ConvertToDate(date):
    return datetime.strftime(date, '%Y-%m-%d %H:%M:%S')
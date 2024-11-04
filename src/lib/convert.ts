import {Timestamp} from "@bufbuild/protobuf";

export const ConvertTimestampToString = (timestamp: Timestamp | undefined): string => {

    if (timestamp === undefined ) {
        return "1970-01-01T00:00:00.000Z";
    }

    if (timestamp && BigInt(timestamp.seconds) === BigInt(0) && timestamp.nanos === 0) {
        return "1970-01-01T00:00:00.000Z";
    }

    if (!timestamp.seconds) {
        return ''; // 기본적으로 잘못된 값에 대한 처리
    }

    // seconds를 기준으로 밀리초 단위로 변환하여 Date 객체 생성
    const date = new Date(Number(timestamp.seconds) * 1000);


    // ISO 형식으로 변환 (2023-10-01T00:00:00.000Z 같은 형식으로 변환됨)
    return date.toISOString();

};

export const ConvertFileToArrayBuffer = (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result;
            if (result instanceof ArrayBuffer) {
                const uint8Array = new Uint8Array(result);
                resolve(uint8Array); // Uint8Array로 변환 후 반환
            } else {
                reject(new Error("파일을 읽는 중 오류가 발생했습니다."));
            }
        };
        reader.onerror = () => {
            reject(new Error("파일을 읽는 중 오류가 발생했습니다."));
        };
        reader.readAsArrayBuffer(file); // 파일을 ArrayBuffer로 읽기
    });
};
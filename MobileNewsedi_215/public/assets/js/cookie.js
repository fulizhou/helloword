/**
 * Created by TGY on 2015/10/16.
 */
//����cookie
//name��cookie�е�����value�Ƕ�Ӧ��ֵ��iTime�Ƕ�ù��ڣ���λΪ�죩
function setCookie(name,value,iTime){
    var oDate = new Date();
    //����cookie����ʱ��
    oDate.setDate(oDate.getDate()+iTime);
    //oDate.setSeconds(oDate.getDate()+iTime);
    document.cookie = name+'='+value+';expires='+oDate.toGMTString();
}
//��ȡcookie
function getCookie(name){
    //cookie�е����ݶ����Էֺżӿո����ֿ�
    var arr = document.cookie.split("; ");
    for(var i=0; i<arr.length; i++){
        if(arr[i].split("=")[0] == name){
            return arr[i].split("=")[1];
        }
    }
    //δ�ҵ���Ӧ��cookie�򷵻ؿ��ַ���
    return '';
}
//ɾ��cookie
function removeCookie(name){
    //����setCookie��������ʱ������Ϊ-1
    setCookie(name,1,-1);
}
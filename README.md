# Ventus Kubernetes Service GitHub Action

Used for setting the target VKS cluster context which will be used by any [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/) command.

```yaml
      uses: ventus-ag/vks-action@master
      with: 
        authUrl: ${{ secrets.AUTHURL }}
        projectDomainName: ${{ secrets.PROJECTDOMAINNAME }}
        domainName: ${{ secrets.DOMAINNAME }}
        userName: ${{ secrets.USERNAME }}
        userDomainName: ${{ secrets.USERDOMAINNAME }}
        userPassword: ${{ secrets.USERPASSWORD }}
        clusterName: ${{ secrets.CLUSTERNAME }}
```

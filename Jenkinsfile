def dockerImage
def pkFile
def pkVersion

pipeline {
  
  environment {
    registry = "reg.gabtec.pt/gabtec/ventilar"
    registryCredential = 'harbor-id'
  }

  agent any
  stages {
    stage('Build') {
      steps {
        echo "Starting building image..."
        script {
          // docker.build registry + ":$BUILD_NUMBER"
          dockerImage = docker.build registry
        }
        echo "Docker image build OK."
      }
    }
    stage('Deploy Image') {
      steps{
        echo "Starting image deploy..."
        script {
          pkFile = readJSON file: 'package.json'
          pkVersion = pkFile.version

          docker.withRegistry( 'https://reg.gabtec.pt/', registryCredential ) {
            //dockerImage.push()
            dockerImage.push("v${pkVersion}")
            dockerImage.push("latest")
          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $registry:v$pkVersion"
      }
    }
  }
}

// node {
//   checkout scm
//   stage('Build') {
//     echo "Starting building docker image..."
//     docker.withRegistry('https://reg.gabtec.pt', 'harbor-id') {
//       def image = docker.build("reg.gabtec.pt/freeapis:v0.2")
//       image.push()
//     }
//   }
// }